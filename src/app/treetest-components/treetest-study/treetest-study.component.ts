import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ITreetestStudy, TreetestStudyService } from '../treetest-study.service';
import { ITreetestTest, TreetestTestService } from '../treetest-test.service';

declare var $: any;

@Component({
  selector: 'app-test',
  templateUrl: './treetest-study.component.html',
  styleUrls: ['./treetest-study.component.css', '../../app.component.css']
})
export class TreetestStudyComponent implements OnDestroy, OnInit {


  public taskIndex: number = 0;
  private tests = [];
  test = {
    clicks: [],
    answer: {},
    time: null
  };
  private startTime;
  private endTime;
  public doingTask: boolean = false;
  public enterPassword: string = ''; // ngModel
  // private studyPassword: string = '';

  public study: ITreetestStudy;
  public password: boolean = false;
  public finished: boolean = false;
  public selectedAnswer: boolean = false;

  // tslint:disable-next-line:no-string-literal
  private id: string = this.route.snapshot.params['id'];

  public intro: boolean = true;
  private showTree: boolean = false;
  public userName: string = ''; // ngModel
  public feedback: string = ''; // ngModel
  public feedbackDone: boolean = false;

  public isPreview: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private treeTestService: TreetestTestService,
    private treetestStudyService: TreetestStudyService
  ) {
    this.isPreview = this.route.snapshot.url[0].path.indexOf('preview') > - 1;
    // var date = (new Date()).toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " ");
  }

  ngOnDestroy() {

    if (this.isPreview) {
      return;
    }

    if (!this.finished) {
      //add results in database
      const test: ITreetestTest = {
        id: this.id,
        results: this.tests,
        finished: false,
        username: this.userName,
        timestamp: (new Date()).toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " "),
        feedback: ""
      };

      this.treeTestService
        .add(test)
        .subscribe(
          res => console.log(res),
          err => console.log(err)
        );
    }
  }

  ngOnInit() {
    // $('[data-toggle="tooltip"]').tooltip();

    if (localStorage.getItem('jstree')) {
      localStorage.removeItem('jstree');
    }
    this.treetestStudyService
      .passwordRequired(this.id)
      .subscribe(
        res => {
          if (res === 'redirect' && !this.isPreview) {
            console.log('redirect');
            this.router.navigate(['study-closed']);
          } else {
            console.log('NO REDIRECT');
          }
          if (res) {
            this.password = true;
          } else {
            this.password = false;
            this.preparePassword();
          }
        },
        err => {
          this.password = false;
          // TODO: we may need this.router.navigate(['study-closed']); ?
        }
      );
  }

  sendFeedback(): void {

    if (this.isPreview) {
      return;
    }

    this.treeTestService
      .feedback(this.userName, this.feedback)
      .subscribe()
      .add(() => this.feedbackDone = true);
  }

  submitFinalAnswer(index, skipped) {

    const instance = $('#study-tree').jstree(true);
    if (skipped) {
      this.test['answer'] = null;
    } else {
    // tslint:disable-next-line:no-string-literal
      this.test['answer'] = (instance.get_selected())[0];
    }
    this.endTime = new Date();
    const timeDiff = (this.endTime - this.startTime) / 1000; // in seconds
    // tslint:disable-next-line:no-string-literal
    this.test['time'] = timeDiff;
    this.startTime = undefined;
    this.endTime = undefined;
    this.tests.push(this.test);
    this.test =  {
      clicks: [],
      answer: {},
      time: null
    };
    $(".jstree").jstree('close_all');
    $('.jstree').jstree('open_node', '#root');
    //$("#study-tree").jstree("close_all", -1);
    this.taskIndex++;
    if (localStorage.getItem('jstree')) {
      localStorage.removeItem('jstree');
    }
    if (this.taskIndex >= this.study.tasks.length) {
      this.finished = true;

      if (!this.isPreview) {
        //add results in database
        const test: ITreetestTest = {
          id: this.id,
          results: this.tests,
          finished: true,
          username: this.userName,
          timestamp: (new Date()).toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " "),
          feedback: ""
        };

        this.treeTestService
          .add(test)
          .subscribe(
            res => console.log(res),
            err => console.log(err)
          );

      }
    }
    this.doingTask = false;
    this.selectedAnswer = false;

  }

  startTask(index) {
    this.showTree = false;
    this.doingTask = false;
    this.startTime = new Date();
    this.createTree('study-tree', (this.study).tree);
    setTimeout(() => {
      if (!this.taskIndex) {
        // tslint:disable-next-line:only-arrow-functions
        $('#study-tree').on('select_node.jstree', (e, data) => {
          if (!data.node.children.length) {
            this.selectedAnswer = true;
          } else {
            if (!this.study.leafNodes) {
              this.selectedAnswer = true;
            } else {
              this.selectedAnswer = false;
            }
            $("#study-tree").jstree("open_node", $("#" + data.node.id));
            var obj =  data.instance.get_node(data.node, true);
            if(obj) {
              obj.siblings('.jstree-open').each(function () { data.instance.close_node($('#study-tree'), 0); });
            }
          }
        });
        $("#study-tree").bind("open_node.jstree", (event, data) => {
          if (data.node.id !== 'root') {
            this.test['clicks'].push(data.node);
          }
          var obj =  data.instance.get_node(data.node, true);

          if (obj) {
            obj.siblings('.jstree-open').each(function () {       data.instance.close_node(this, 0);
            data.instance.close_all(this, 0);
            });
          }
        });
      }
    }, 500);
  }

  createTree(id, content) {
    $('#' + id).jstree({
      core : {
        expand_selected_onload : false,
        animation : 0,
        check_callback : function test(op, node, par, pos, more) {
          console.log('here!!!');
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
    setTimeout(() => {
      $('#' + id).jstree("close_all");
      $('#' + id).jstree('open_node', '#root');
      this.doingTask = true;
    }, 500);
  }

  preparePassword() {
    this.treetestStudyService
      .checkPassword(this.id, this.enterPassword)
      .subscribe(
        res => {
          if (!res) {
            alert('Wrong password!');
          } else {
            this.study = res as ITreetestStudy;
          }
        },
        err => alert('Wrong password!')
      );
  }
}
