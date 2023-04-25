import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, ILoginResponse } from 'src/app/authentification.service';
import { EditComponent } from 'src/app/guard';
import { IJstreeNodeAlt, ITreetestStudy, ITreetestTask, TreetestStudyService } from '../treetest-study.service';
import { TreetestTestService } from '../treetest-test.service';

declare var $: any;

@Component({
  selector: 'app-create-tree-test',
  templateUrl: './create-tree-test.component.html',
  styleUrls: ['./create-tree-test.component.css', '../../app.component.css']
})
export class CreateTestComponent implements OnInit, EditComponent {

  public randomTestId: string = Math.random().toString(36).substring(2, 15);
  public testName = '';
  public studyPassword = '';

  public tasks: Array<ITreetestTask> = [];
  public currentTaskIndex = 0;
  private answerTreeCreated = false;

  // tslint:disable-next-line:no-string-literal
  public id = this.route.snapshot.params['id'];

  public welcomeMessage = 'Welcome to the study. Your answers can help improving the information hierarchy.';
  public instructions = 'Read the task, and find the appropriate answer in the tree.';
  public thankYouScreen = 'Thank you for your participation.';
  public leaveFeedback = 'Your results are saved. You can write us your feedback (optional).';

  public leafNodes = true;
  public orderNumbers = true;

  public canSave = false;
  public isLocked: boolean = false;

  private csvContent: string;
  public baseurl: string = '';

  private currentUser: ILoginResponse;

  private originalTest = null; // TODO: should be of type ITreetestStudy

  constructor(
    private treetestStudyService: TreetestStudyService,
    private treetestTestService: TreetestTestService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    this.baseurl = location.origin;
    this.currentUser = this.authService.getCurrentUser();
    if (this.id) {
      this.isLocked = true;
      this.treetestStudyService
        .get(this.id)
        .subscribe(res => {
          this.testName = res.name;
          this.studyPassword = res.password;
          this.createTree('test-tree', res.tree);
          this.tasks = res.tasks;
          this.welcomeMessage = res.welcomeMessage;
          this.instructions = res.instructions;
          this.thankYouScreen = res.thankYouScreen;
          this.leaveFeedback = res.leaveFeedback;
          this.isLocked = res.isLocked;
          if (res.leafNodes !== undefined) {
            this.leafNodes = res.leafNodes;
            this.orderNumbers = res.orderNumbers;
          }

          // check isLocked flag -> we are in edit study mode
          if (!res.hasOwnProperty('isLocked') || res.isLocked === null) {
            this.isLocked = true;
          }

          this.originalTest = this.createTestData();
        });

      // get it from database
      this.randomTestId = this.id;
      // this.testName = t


    } else {
        const arrayCollection: Array<IJstreeNodeAlt> = [{
          id: 'root',
          parent: '#',
          text: 'Root',
          state: {
            selected : true
          }
        }];
        this.createTree('test-tree', arrayCollection);
        this.originalTest = this.createTestData();
    }
  }

  createTestData() { // TODO: should return type ITreetestStudy
    return {
      name: this.testName,
      password: this.studyPassword,
      tasks: this.tasks,
      welcomeMessage: this.welcomeMessage,
      instructions: this.instructions,
      thankYouScreen: this.thankYouScreen,
      leaveFeedback: this.leaveFeedback,
      leafNodes: this.leafNodes,
      orderNumbers: this.orderNumbers,
    };
  }

  reset(): void {
    this.testName = this.originalTest.name;
    this.studyPassword = this.originalTest.password;
    this.tasks = this.originalTest.tasks;
    this.welcomeMessage = this.originalTest.welcomeMessage;
    this.instructions = this.originalTest.instructions;
    this.thankYouScreen = this.originalTest.thankYouScreen;
    this.leaveFeedback = this.originalTest.leaveFeedback;
    this.leafNodes = this.originalTest.leafNodes;
    this.orderNumbers = this.originalTest.orderNumbers;
  }

  hasChanges(): boolean {
    const originalTest = JSON.stringify(this.originalTest);
    const testAfterEditing = JSON.stringify(this.createTestData());
    return testAfterEditing != originalTest;
  }

  get isEditMode() {
    return !!this.id;
  }

  open(link: string): void {
    if (link === "tasks") {
      this.defineCorrectAnswer(0);
    }
    $('a[href="#' + link + '"]').click();
  }

  /*getData() {
    const v = $('#test-tree').jstree(true).get_json('#', {flat: true});
    const mytext = JSON.stringify(v);
    this.createTree('test-tree2', v);
  }*/

  onFileLoad(fileLoadedEvent) {
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;
  }

  onFileSelect(input: HTMLInputElement) {

    const files = input.files;
    var content = this.csvContent;
    if (files && files.length) {

      const fileToRead = files[0];
      let extension = fileToRead.name.split(".");
      if (extension[extension.length -1] !== "csv") {
        alert("File extension is wrong! Please provide .csv file.");
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = this.onFileLoad;

      fileReader.readAsText(fileToRead, "UTF-8");

      let lines = [];

      fileReader.onload = (e) => {
        let spliter = ",";
        let csv = fileReader.result;
        let allTextLines = (<any>csv).split(/\r|\n|\r/);
        let headers = allTextLines[0].split(',');
        if (headers.length <= 1) {
          headers = allTextLines[0].split(';');
          spliter = ";";
        }

        for (let i = 0; i < allTextLines.length; i++) {
          // split content based on comma
          let data = allTextLines[i].split(spliter);
          if (data.length === headers.length) {
            let tarr = [];
            for (let j = 0; j < headers.length; j++) {
              tarr.push(data[j]);
            }

            lines.push(tarr);
          }
        }



        var currentIndex = 0;
        var node = {
          id: "root",
          text: lines[0][0].replace(/"/g,''),
          index: 0,
          parent: "#"
        };
        var currentNode = {
          id: "",
          text: "",
          index: null,
          parent: ""
        };
        var items = [node];
        for (var i = 1; i < lines.length; i++) { //start from second line
          currentIndex = 0; //current row position
          for (var j = 0; j < lines[i].length; j++) { //go through whole line until finding item which is tabbed
            if (lines[i][j] === '') {
              currentIndex++;
            } else {
              currentNode = {
                id: Math.random().toString(36).substring(7),
                text: lines[i][j].replace(/"/g,''),
                index: currentIndex,
                parent: ""
              };
              for (var k = items.length - 1; k >= 0; k--) {
                if (currentNode.text === "University") {
                }
                if (items[k].index === currentIndex - 1) {
                  if (currentNode.text === "University") {
                  }
                  currentNode.parent = items[k].id;
                  break;
                }
              }
              items.push(currentNode);
            }
          }
        }

        // this.itemsFinal = items;

        $('#test-tree').jstree("destroy").empty();
        this.createTree('test-tree', []);

        setTimeout(() => {
          for (var i = 0; i < items.length; i++) {
            $('#test-tree').jstree().create_node((<any>items[i]).parent, {
              "id": items[i].id,
              "text": items[i].text,
              "parent": (<any>items[i]).parent,
              "data": { "index": items[i].index },
            }, "last", function() {
            });
          }
        }, 300);

        $('#test-tree-answer').jstree("destroy").empty();
        this.createTree('test-tree-answer', []);

        setTimeout(() => {
          for (var i = 0; i < items.length; i++) {
            $('#test-tree-answer').jstree().create_node((<any>items[i]).parent, {
              "id": items[i].id,
              "text": items[i].text,
              "parent": (<any>items[i]).parent,
              "data": { "index": items[i].index },
            }, "last", function() {
            });
          }
        }, 300);

      }
    }

    (<any>document).getElementById("file").value = "";

  }

  createTree(id: string, content: Array<IJstreeNodeAlt>): void {
    if (id === "test-tree-answer") {
      console.log("creating tree!");
      console.log(content);
      //$('#test-tree-answer').jstree("destroy").empty();
      //this.createTree('test-tree-answer', []);
    }

    if (localStorage.getItem('jstree')) {
      localStorage.removeItem('jstree');
    }
    $('#' + id).jstree({
      core : {
        animation : 0,
        check_callback : function test(op, node, par, pos, more) {
            if (op === 'delete_node') {
                if (node.parent === '#') {
                    alert('Cannot delete root node!');
                    return false;
                }
            }
        },
        themes : { icons: false  },
        data : content
      },
      types : {
        root : {
          icon : '/static/3.3.7/assets/images/tree_icon.png',
          valid_children : ['default']
        },
        default : {
          valid_children : ['default', 'file']
        },
        file : {
          icon : 'glyphicon glyphicon-file',
          valid_children : []
        }
      },
      plugins : [
        'contextmenu', 'dnd', 'search',
        'state', 'types', 'wholerow'
      ]
    });

    //if (!this.answerTreeCreated) {
      $('#test-tree-answer').on('select_node.jstree', (e, data) => {
        if (!data.node.children.length) {
          this.canSave = true;
          this.saveAnswer();
        }
        else if (!this.leafNodes) {
          this.canSave = true;
          this.saveAnswer();
        }
        else this.canSave = false;;
      });
    //}
    this.answerTreeCreated = true;
    if (id === 'test-tree') {
      $('#' + id).jstree('select_node', 'root');
    } else if (id === 'test-tree-answer') {
      setTimeout(() => {
        $('#' + id).jstree("deselect_all");
        if (this.tasks[this.currentTaskIndex] && this.tasks[this.currentTaskIndex].id) {
        $('#' + id).jstree('select_node', this.tasks[this.currentTaskIndex].id);
        } else {
          $('#' + id).jstree(true).select_node('root');
        }
      }, 100);
    }
  }

  addNode(): void {
    const currentNode = $('#test-tree').jstree('get_selected');
    $('#test-tree').jstree('create_node', currentNode, {text : 'new Node'}, 'last' , function test(newNode) {
        $('#test-tree').jstree('open_node', currentNode);
        const inst = $.jstree.reference(newNode);
        inst.edit(newNode);
    });
  }

  renameNode(): void {
    const instance = $('#test-tree').jstree(true);
    instance.edit(instance.get_selected());
  }

  deleteSelectedNode(): void {
    const instance = $('#test-tree').jstree(true);
    instance.delete_node(instance.get_selected());
  }

  setIndex(index: number): void {
    this.currentTaskIndex = index;
    this.defineCorrectAnswer(index);
  }

  defineCorrectAnswer(index: number): void {
    const v = $('#test-tree').jstree(true).get_json('#', {flat: true});
    this.currentTaskIndex = index;
    setTimeout(() => { this.createTree('test-tree-answer', v); }, 0);
  }

  saveAnswer(): void {
    if (this.isLocked) return;
    const selected = ($('#test-tree-answer').jstree('get_selected', true))[0];
    this.tasks[this.currentTaskIndex].answer = selected.text;
    this.tasks[this.currentTaskIndex].id = selected.id;
  }

  answerNotValid(): boolean {
    const selected = ($('#test-tree-answer').jstree('get_selected', true))[0];
    if ($('#test-tree-answer').jstree('get_selected', true)) {
      const v = $('#test-tree').jstree(true).get_json('#', {flat: true});
      for (const el of v) {
        if (el.parent === selected.text) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  addTask(): void {
    if (this.isLocked) return;
    const task: ITreetestTask = {
      text: `Where would you expect to find ... ?`,
      answer: '',
      id: ''
    };
    this.tasks.push(task);
  }

  deleteTask(index: number): void {
    if (this.isLocked) return;
    this.tasks.splice(index, 1);
  }

  createTest(): ITreetestStudy {

    let passTmp = "";
    if (this.studyPassword === "") {
      passTmp = "empty";
    } else {
      passTmp = this.studyPassword;
    }
    const launchable: boolean = this.tasks.length > 0 ? true : false;

    return {
      name: this.testName,
      launched: false,
      password: passTmp,
      id: this.randomTestId, // this.id? this.id : this.randomTestId,
      tree: $('#test-tree').jstree(true).get_json('#', {flat: true}),
      tasks: this.tasks,
      user: this.currentUser?.email,
      welcomeMessage: this.welcomeMessage,
      instructions: this.instructions,
      thankYouScreen: this.thankYouScreen,
      leaveFeedback: this.leaveFeedback,
      leafNodes: this.leafNodes,
      orderNumbers: this.orderNumbers,
      lastEnded: new Date(),
      lastLaunched: new Date(),
      isLaunchable: launchable,
      isLocked: false
    };
  }

  cancel(): void {
    this.reset();
    this.router.navigate(['/tests']);
  }

  saveTest(showPopup?: boolean): void {

    const test = this.createTest();

    if(showPopup) {
      let lang = localStorage.getItem('tt-language');
      if (lang === 'en') {
        alert("Saved!");
      } else {
        alert("Gespeichert!");
      }
    }

    if (!this.id) {
      this.treetestStudyService
        .add(test)
        .subscribe(res => {
          this.id = this.randomTestId;
          this.reset();
          this.router.navigate(['/tests']);
        });
    } else {
      this.treetestStudyService
        .update(test)
        .subscribe(res => {
          this.reset();
          this.router.navigate(['/tests']);
        });
    }
  }
}
