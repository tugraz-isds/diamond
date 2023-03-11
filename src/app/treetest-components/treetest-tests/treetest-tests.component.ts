import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Parser } from '@json2csv/plainjs';
import * as d3 from 'd3';
import { TreeNode, PathPoint} from "./TreeNode";
import { ITreetestTest, TreetestTestService } from '../treetest-test.service';
import { ITreetestStudy } from '../treetest-study.service';

declare var $: any;

export type TPath = Array<PathPoint>;

export interface IPathtreeParticipant {
  id: string;
  name: string;
  paths: Array<TPath>
}

@Component({
  selector: 'app-results',
  templateUrl: './treetest-tests.component.html',
  styleUrls: ['./treetest-tests.component.css', '../../app.component.css']
})
export class TreetestTestsComponent implements OnInit {

  // tslint:disable-next-line:no-string-literal
  private id: string = this.route.snapshot.params['id'];
  public tests: Array<ITreetestTest> = [];
  public study: ITreetestStudy;
  public numberCompleted: number = 0;
  public numberLeft: number = 0;

  public totalParticipants: number = 0;
  public numberIncludedParticipants: number = 0;

  public totalSecondsTaken: number = 0;
  public averageSecondsByUser: number;
  public averageMinutesByUser: number = 0;

  public totalLongest: number = 0;
  public longestMinutes: number = 0;
  public longestSeconds: number = 0;

  public totalShortest: number = 1000000;
  public shortestMinutes: number = 0;
  public shortestSeconds: number = 0;

  public totalTasksDone: number = 0;
  public totalTasksCorrect: number = 0;
  public percentageCorrect: number = 0;

  public totalTasksDirect = 0;
  public percentageDirect = 0;

  public firstClicks: Array<any> = [];
  private percentageFirstClick: number = 0;

  tasks = [];
  task = {};

  tree = [];
  destinations;
  private treemap: TreeNode;
  root;
  svg;
  duration = 750;
  i = 0;
  deleteParticipantResultIndex;
  irrelevantItemsCollapsed = false;
  paths = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private treeTestService: TreetestTestService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.treeTestService
        .getById(this.id)
        .subscribe(res => {
          this.tests = res.result;
          this.study = res.test[0];
          this.tree = this.study.tree;
          this.treemap = new TreeNode(this.tree, this.tree[0], 1);
          this.treemap.fillTree(this.tests);
          // const treemapArray = this.treemap.getDepthFirstArray();
          this.paths = this.retrievePaths();
          // console.log(this.paths); // LR: Create path table from this.
          this.prepareResults();
        });
    } else {
      this.router.navigate(['tests']);
    }
    console.log(this.id);
  }

  openPathTree(index) {
    const url = location.origin + '/#/pie-tree/' + this.id + '/' + index;
    window.open(url, '_blank');
  }

  updateResultParticipants(index) {
    setTimeout(() => {
      this.prepareResults();
    }, 300);
  }

  getIncludeResultNumber() {
    let inc = 0;
    for (let i = 0; i < this.tests.length; i++) {
      if (!this.tests[i].excluded) { inc++; }
    }
    return inc;
  }

  prepareResults() {
    let currentTime = 0;


    this.numberCompleted = 0;
    this.numberLeft = 0;

    this.totalParticipants = 0;
    this.numberIncludedParticipants = 0;

    this.totalSecondsTaken = 0;
    this.averageSecondsByUser;
    this.averageMinutesByUser = 0;

    this.totalLongest = 0;
    this.longestMinutes = 0;
    this.longestSeconds = 0;

    this.totalShortest = 1000000;
    this.shortestMinutes = 0;
    this.shortestSeconds = 0;

    this.totalTasksDone = 0;
    this.totalTasksCorrect = 0;
    this.percentageCorrect = 0;

    this.totalTasksDirect = 0;
    this.percentageDirect = 0;



    for (let i = 0; i < this.tests.length; i++) {
      this.totalParticipants ++;

      if (!this.tests[i].excluded) {
        this.numberIncludedParticipants++;
        if (this.tests[i].finished) { this.numberCompleted++; }
        else { this.numberLeft++; }
        for (let j = 0; j < this.tests[i].results.length; j++) {
          this.totalSecondsTaken += this.tests[i].results[j].time;
          currentTime += this.tests[i].results[j].time;
        }

        if (this.totalLongest < currentTime) {
          this.totalLongest = currentTime;
        }

        if (this.totalShortest > currentTime) {
          this.totalShortest = currentTime;
        }

        currentTime = 0;
      }

    }

    this.averageSecondsByUser = Math.floor(this.totalSecondsTaken / this.getIncludeResultNumber());
    this.totalSecondsTaken = Math.floor(this.totalSecondsTaken);

    this.longestSeconds = Math.floor(this.totalLongest);

    // shortest:
    this.shortestSeconds = Math.floor(this.totalShortest);

    this.getTaskResults();
    this.prepareTaskAnalysis();
  }

  prepareTaskAnalysis() {
    const tasks = [];
    let task = {};

    let directSuccess = 0;
    let indirectSuccess = 0;
    let directFailure = 0;
    let indirectFailure = 0;
    let skipped = 0;
    let time = 0;
    let minTime = 100000;
    let maxTime = 0;
    // go through every task
    for (let i = 0; i < this.study.tasks.length; i++) {
      // go through every participant
      for (let j = 0; j < this.tests.length; j++) {
        if (this.tests[j] && !this.tests[j].excluded) {
          if (this.tests[j].results[i]) {

            if (this.tests[j].results[i].time < minTime) {
              minTime = this.tests[j].results[i].time;
            }

            if (this.tests[j].results[i].time > maxTime) {
              maxTime = this.tests[j].results[i].time;
            }

            time += this.tests[j].results[i].time;
            if (!this.tests[j].results[i].answer) {
              skipped++;
            } else {
              if (!this.isBackTracking(this.tests[j].results[i].clicks)) {
                if (this.tests[j].results[i].answer && this.tests[j].results[i].answer === this.study.tasks[i].id) { // it is correct
                  directSuccess++;
                } else { // it is incorrect
                  directFailure++;
                }
              } else { // backtracking
                if (this.tests[j].results[i].answer && this.tests[j].results[i].answer === this.study.tasks[i].id) { // it is correct
                  indirectSuccess++;
                } else { // it is incorrect
                  indirectFailure++;

                }
              }
            }
          }
        }
      }
      (task as any).skipped = skipped;
      (task as any).directSuccess = directSuccess;
      (task as any).indirectSuccess = indirectSuccess;
      (task as any).directFailure = directFailure;
      (task as any).indirectFailure = indirectFailure;

      (task as any).minTime = minTime;
      (task as any).maxTime = maxTime;

      const percentageDirect = Math.round((directSuccess + directFailure) * 100 / this.numberIncludedParticipants * 100) / 100;
      const percentageCorrect = Math.round((directSuccess + indirectSuccess) * 100 / this.numberIncludedParticipants * 100) / 100;
      (task as any).percentageDirect = Math.round(percentageDirect * 10) / 10;
      (task as any).percentageCorrect = Math.round(percentageCorrect * 10) / 10;


      const averageTime = Math.round(time / this.tests.length * 100) / 100;

      (task as any).averageTime = averageTime;

      tasks[i] = task;
      task = {};
      directSuccess = 0;
      indirectSuccess = 0;
      directFailure = 0;
      indirectFailure = 0;
      skipped = 0;
      time = 0;
      minTime = 100000;
      maxTime = 0;
    }

    this.tasks = tasks;

    this.destinationTable();

    this.firstClickStatistic();

  }

  firstClickStatistic(){

    // Returns the most frequently occuring string in a list.
    function mode(arr){
      return arr.sort((a,b) =>
            arr.filter(v => v===a).length
          - arr.filter(v => v===b).length
      ).pop();
    }

    for(let i = 0; i < this.tasks.length; i++){

      let firstClicks = [];

      // Get most first clicked node.
      for(let j = 0; j < this.paths.length; j++){
        firstClicks.push(this.paths[j].paths[i][0].node.data.text);
      }

      const mostFirstClicked = mode(firstClicks);
      let firstClickedNrOfTimes = 0;

      // Get nr of clicks for this node name.
      for(let j = 0; j < this.paths.length; j++){
        if(this.paths[j].paths[i][0].node.data.text === mostFirstClicked){
          firstClickedNrOfTimes += 1;
        }
      }

      const percentageFirstClicked = Math.floor((firstClickedNrOfTimes * 100) / this.paths.length);

      // Save first click for this task.
      // [0] is string, [1] nr of clicks, [2] percentage
      let firstClicksForThisTask = [];
      firstClicksForThisTask.push(mostFirstClicked);
      firstClicksForThisTask.push(firstClickedNrOfTimes);
      firstClicksForThisTask.push(percentageFirstClicked);

      // This container is used by Angular in the frontend.
      this.firstClicks.push(firstClicksForThisTask);
    }
  }

  preparePathTree(index) {

    let data = this.getPathTreeData(index);
    data = this.removeKeys(data, ['parent', 'id']);

    // set the dimensions and margins of the graph
    const width = 460;
    const height = 460;

    // append the svg object to the body of the page
    const svg = d3.select('#pathtreesvg')
      .append('svg')
        .attr('viewBox', '-70 0 900 900')
        .attr('preserveAspectRatio', 'xMinYMin')
        .attr('id', 'mysvg')
      .append('g');


      // Create the cluster layout:
    const cluster = d3.cluster()
        .size([height, width - 100]);  // 100 is the margin I will have on the right side

      // Give the data to this cluster layout:
    const root = d3.hierarchy(data);
    cluster(root);


  // worked with text
    const node = svg.selectAll('g')
  .data(root.descendants());

// Enter any new modes at the parent's previous position.
    const nodeEnter = node.enter().append('g');

// Add Circle for the nodes
    nodeEnter.append('circle')
.attr('r', 7)
.style('fill', '#69b3a2')
.attr('stroke', 'black')
.style('stroke-width', 2);

// Add labels for the nodes
    nodeEnter.append('text')
  .attr('dy', '.35em')
  .attr('x', function(d) {
      return d.children || d.children ? -13 : 13;
  })
  .attr('text-anchor', function(d) {
      return d.children || d.children ? 'end' : 'start';
  })
  .text(function(d) { return d.data.name; });

  }

  getPathTreeData(taskIndex) {

    // go through each participant
    for (let i = 0; i < this.tests.length; i++) {
      // go through given task clicks
      for (let j = 0; j < this.tests[i].results[taskIndex].clicks.length; j++) {

        for (let k = 0; k < this.tree.length; k++) {
          if (this.tree[k].id === this.tests[i].results[taskIndex].clicks[j].id) {
            this.tree[k].name = this.tree[k].text;
            if (!this.tree[k].clicked) {
              this.tree[k].clicked = true;
              this.tree[k].clickNumbers = 1;
            } else {
              this.tree[k].clickNumbers++;
            }

          }
        }
      }
    }

    const newTree = [];

    for (let k = 0; k < this.tree.length; k++) {
      if (this.tree[k].clicked) {
        // newTree.push(this.tree[k]);
        newTree.push({
          name: this.tree[k].text,
          parent: this.tree[k].parent,
          id: this.tree[k].id
        });
      }
    }

    const data = {
      name: this.tree[0].text,
      children: this.getNestedChildren(newTree, 'root')
    };

    return data;
  }

  getNestedChildren(arr, parent) {
    const out = [];
    for (const i in arr) {
        if (arr[i].parent == parent) {
            const children = this.getNestedChildren(arr, arr[i].id);

            if (children.length) {
                arr[i].children = children;
            }
            out.push(arr[i]);
        }
    }
    return out;
}

removeKeys(obj, keys){
  let index;
  for (const prop in obj) {
      // important check that this is objects own property
      // not from prototype prop inherited
      if (obj.hasOwnProperty(prop)){
          switch (typeof(obj[prop])){
              case 'string':
                  index = keys.indexOf(prop);
                  if (index > -1){
                      delete obj[prop];
                  }
                  break;
              case 'object':
                  index = keys.indexOf(prop);
                  if (index > -1){
                      delete obj[prop];
                  }else{
                      this.removeKeys(obj[prop], keys);
                  }
                  break;
          }
      }
  }
  return obj;
}





  getCorrectTasks(results) {
    let totalCorrect = 0;
    if (!results.length) { return totalCorrect; }
    for (let i = 0; i < results.length; i++) {
      if (results[i].answer && results[i].answer === this.study.tasks[i].id) {
        totalCorrect++;
      }
    }
    return totalCorrect;
  }

  getSkippedTasks(results) {
    let totalSkipped = 0;
    if (!results.length) { return totalSkipped; }
    for (let i = 0; i < results.length; i++) {
      if (!results[i].answer) {
        totalSkipped++;
      }
    }
    return totalSkipped;
  }

  getCompletedTasks(results) {
    let totalCompleted = 0;
    if (!results.length) { return totalCompleted; }
    for (let i = 0; i < results.length; i++) {
      if (results[i].answer) {
        totalCompleted++;
      }
    }
    return totalCompleted;
  }

  getDuration(results) {
    if (!results.finished) {
      return 'Abandoned';
    }
    let totalSeconds = 0;
    const totalMinutes = 0;
    const totalHours = 0;
    for (let i = 0; i < results.results.length; i++) {
      totalSeconds += results.results[i].time;
    }
    return Math.floor(totalSeconds);
  }

  getBackgroundColor(taskIndex, treeItemIndex, number, answer) {
    if (this.study.tasks[taskIndex].id === answer) {
      return 'rgba(161,212,36,0.7)';
    }
    let totalNumberOfAnswers = 0;
    // go through every result
    for (let i = 0; i < this.tests.length; i++) {
        if (this.tests[i].results[taskIndex]) {
          totalNumberOfAnswers++;
        }
    }

    const percentage = (number * 100) / totalNumberOfAnswers;
    if (percentage >= 20) { return 'rgba(218,31,71,0.7)'; }

    return 'rgba(245,98,0,0.7)';
  }

  destinationTable() {
    this.destinations = [];
    let destination = [];

    // go through every task
    for (let k = 0; k < this.study.tasks.length; k++) {
      // go through every result
      for (let i = 0; i < this.tests.length; i++) {
        if (!this.tests[i].excluded) {
          if (this.tests[i].results[k]) {
            if (!destination[this.tests[i].results[k].answer]) {
              destination[this.tests[i].results[k].answer] = 1;
            } else {
              destination[this.tests[i].results[k].answer]++;
            }
          }
        }
      }
      this.destinations.push(destination);
      destination = [];
    }
  }

  isBackTracking(clicks) {
    if (clicks.length < 2) {
      return false;
    }
    for (let k = 1; k < clicks.length; k++) {
      if (clicks[k].parent !== clicks[k - 1].id ) {
        return true;
      }
    }
    return false;
  }

  getTaskResults() {
    let backtracking = false;
    for (let i = 0; i < this.tests.length; i++) {
      if (!this.tests[i].excluded) {
        for (let j = 0; j < this.tests[i].results.length; j++) {
          this.totalTasksDone++;
          if (this.study.tasks[j] && this.tests[i].results[j].answer && this.tests[i].results[j].answer === this.study.tasks[j].id) {
            this.totalTasksCorrect++;
          }

          // check directness
          if (this.tests[i].results[j].clicks.length < 2) {
            this.totalTasksDirect++;
          } else {
            for (let k = 1; k < this.tests[i].results[j].clicks.length; k++) {
              if (this.tests[i].results[j].clicks[k].parent !== this.tests[i].results[j].clicks[k - 1].id ) {
                backtracking = true;
                // k = this.results[i].results[j].clicks.length;
              }
            }
            if (!backtracking) {
              this.totalTasksDirect++;
            }
            backtracking = false;
          }
        }
      }
    }
    this.percentageCorrect = Math.floor((this.totalTasksCorrect * 100) / this.totalTasksDone);
    this.percentageDirect = Math.floor((this.totalTasksDirect * 100) / this.totalTasksDone);
  }

  getSvg() {
    // get svg element.
    const svg = document.getElementById('mysvg');

    // get svg source.
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    // add name spaces.
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    // convert svg source to URI data scheme.
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);

    // set url value to a element's href attribute.
    (document as any).getElementById('link').href = url;
    // you can download svg file by right click menu.
  }

  exportcsv(){
    const rows = [];
    for(let i = 0; i < this.tests.length; i++) {
      if (!this.tests[i].excluded) {
        const item = {
          Name: this.tests[i].username,
          'Date and Time': this.tests[i].timestamp,
          'Duration [s]': this.getDuration(this.tests[i]),
          [`Tasks Completed (out of ${this.tasks.length})`]: this.getCompletedTasks(this.tests[i].results),
          [`Tasks Skipped (out of ${this.tasks.length})`]: this.getSkippedTasks(this.tests[i].results),
          [`Tasks Correct (out of ${this.tasks.length})`]: this.getCorrectTasks(this.tests[i].results),
          Feedback: this.tests[i].feedback
        };
        rows.push(item);
      }
    }

    const json2csvParser = new Parser();
    const csvContent = 'data:text/csv;charset=utf-8,' + json2csvParser.parse(rows);

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'participants.csv');
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
  }

  exportDestinationsCSV() {
    const treemapArray = this.treemap.getDepthFirstArray();
    const maxLevel = treemapArray.reduce((currentLevel, node) => node.level > currentLevel ? node.level : currentLevel, 0);
    const tasksCount = this.study.tasks.length;

    const rows = [];
    const firstRow = [];
    for (let i = 1; i <= maxLevel; i++) { firstRow.push(""); }
    for (let t = 1; t <= tasksCount; t++) { firstRow.push(t.toString()); }
    rows.push(firstRow);

    for (const node of treemapArray) {
      if (this.irrelevantItemsCollapsed && !node.hasAnswerInPath()) { continue; }
      const row = [];
      for (let i = 1; i < node.level; i++) { row.push(""); }
      row.push(node.data.text);
      for (let i = node.level + 1; i <= maxLevel; i++) { row.push(""); }
      node.answerCount.forEach(count => {
        row.push(count === 0 ? undefined : count);
      });
      rows.push(row);
    }

    const lastrow = [ "Skipped" ];
    for (let i = 2; i <= maxLevel; i++) { lastrow.push(""); }
    this.tasks.forEach(task => lastrow.push(task.skipped));
    rows.push(lastrow);
    const csvContent = 'data:text/csv;charset=utf-8,'
       + rows.map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'destinations.csv');
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
  }

  excludeParticpant(result: ITreetestTest, index: number): void {
    const temp: ITreetestTest = {
      _id: result._id,
      id: result.id,
      results: result.results,
      finished: result.finished,
      username: result.username,
      timestamp: result.timestamp,
      feedback: result.feedback,
      excluded: true
    };

    this.treeTestService
      .update(temp)
      .subscribe(res => {
        this.tests[index].excluded = true;
        this.prepareResults();
      });
  }

  includeParticipant(result: ITreetestTest, index: number): void {
    const temp: ITreetestTest = {
      _id: result._id,
      id: result.id,
      results: result.results,
      finished: result.finished,
      username: result.username,
      timestamp: result.timestamp,
      feedback: result.feedback,
      excluded: false
    };

    this.treeTestService
      .update(temp)
      .subscribe(res => {
        this.tests[index].excluded = false;
        this.prepareResults();
      });
  }

  prepareDeleteParticipantResult(): void {

    const testId = this.tests[this.deleteParticipantResultIndex]._id;

    this.treeTestService
      .delete(testId)
      .subscribe(
        res => {
          this.treeTestService
            .getById(this.id)
            .subscribe(
              res => {
                this.tests = res.result;
                this.study = res.test[0];
                this.tree = this.study.tree;
                this.prepareResults();
              }
            );
        },
        err => alert('An error occured. Please try again later.')
      )
      .add(() => $('#myModal10').modal('hide'))
  }

  toggleIrrelevantItems(): void {
    this.irrelevantItemsCollapsed = !this.irrelevantItemsCollapsed;
  }

  irrelevantItemDisabled(item: TreeNode): boolean {
    return this.irrelevantItemsCollapsed && !item.hasAnswerInPath();
  }

  retrievePaths(): Array<IPathtreeParticipant> {
    let participants: Array<IPathtreeParticipant> = [];
    for (const test of this.tests) {
      if (test.excluded) { continue; }
      const paths: Array<TPath> = [];
      for (const task of test.results) {
        paths.push(this.retrievePath([...task.clicks, {id: task.answer}])); // because answer is not included in clicks
      }
      participants.push({
        id: test.id,
        name: test.username,
        paths
      });
    }
    return participants;
  }

  retrievePath(clicks: any[], nodeId?: string): TPath {
    const startNode = this.treemap.findNodeById(clicks[0].id);
    const startPoint: PathPoint = {
      node: startNode,
      direction: 'start'
    };
    return [startPoint, ...startNode.retrievePath(clicks.slice(1))];
  }

}
