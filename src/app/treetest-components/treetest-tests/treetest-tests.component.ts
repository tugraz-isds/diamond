import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../user.service';

import { Parser } from '@json2csv/plainjs';

declare var Chart: any;
import * as d3 from 'd3';
import TreeNode, {PathPoint} from "./TreeNode";

declare var $: any;

@Component({
  selector: 'app-results',
  templateUrl: './treetest-tests.component.html',
  styleUrls: ['./treetest-tests.component.css', '../../app.component.css']
})
export class TreetestTestsComponent implements OnInit {

  // tslint:disable-next-line:no-string-literal
  id = this.route.snapshot.params['id'];
  tests = [];
  study;
  numberCompleted = 0;
  numberLeft = 0;

  totalParticipants = 0;
  numberIncludedParticipants = 0;

  totalSecondsTaken = 0;
  averageSecondsByUser;
  averageMinutesByUser = 0;

  totalLongest = 0;
  longestMinutes = 0;
  longestSeconds = 0;

  totalShortest = 1000000;
  shortestMinutes = 0;
  shortestSeconds = 0;

  totalTasksDone = 0;
  totalTasksCorrect = 0;
  percentageCorrect = 0;

  totalTasksDirect = 0;
  percentageDirect = 0;

  tasks = [];
  task = {};

  tree = [];
  destinations;
  treemap: TreeNode;
  root;
  svg;
  duration = 750;
  i = 0;
  deleteParticipantResultIndex;
  irrelevantItemsCollapsed = false;
  paths = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    if (this.id) {
      this.resultsInformation()
        .subscribe(
          res => {
            this.tests = (res as any).result;
            this.study = (res as any).test[0];
            this.tree = (res as any).test[0].tree;
            this.treemap = new TreeNode(this.tree, this.tree[0], 1);
            this.treemap.fillTree(this.tests);
            const treemapArray = this.treemap.getDepthFirstArray();
            // console.log(this.tests)
            // console.log(this.study)
            // console.log(this.tree)
            // console.log(this.treemap)
            this.paths = this.retrievePaths();
            console.log(this.paths);
            this.prepareResults();
          },
          err => {
            console.log(err);
          }
        );
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

  resultsInformation() {
    /*const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});*/
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
          Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
    return this.http.post(this.userService.serverUrl + '/users/tree-tests/' + this.id, '', httpOptions);
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

  excludeParticpant(result, index){
    const temp = {
      _id: result._id,
      id: result.id,
      results: result.results,
      finished: result.finished,
      username: result.username,
      timestamp: result.timestamp,
      feedback: result.feedback,
      excluded: true
    };
    // console.log(temp);
    this.updateParticipantsTest(temp).subscribe(
        res => {
          console.log(res);
          this.tests[index].excluded = true;
          this.prepareResults();
        },
        err => {
          console.log(err);
        }
    );
  }
  includeParticipant(result, index){
    const temp = {
      _id: result._id,
      id: result.id,
      results: result.results,
      finished: result.finished,
      username: result.username,
      timestamp: result.timestamp,
      feedback: result.feedback,
      excluded: false
    };
    this.updateParticipantsTest(temp).subscribe(
        res => {
          console.log(res);
          this.tests[index].excluded = false;
          this.prepareResults();
        },
        err => {
          console.log(err);
        }
    );
  }
  prepareDeleteParticipantResult() {
    console.log('prepared!!');
    console.log(this.tests);
    this.deleteParticipantResult()
    .subscribe(
      res => {
        this.resultsInformation()
        .subscribe(
          res => {
            this.tests = (res as any).result;
            this.study = (res as any).test[0];
            this.tree = (res as any).test[0].tree;
            this.prepareResults();
          },
          err => {
            console.log(err);
          }
        );
        $('#myModal10').modal('hide');
      },
      err => {
        $('#myModal10').modal('hide');
        alert('An error occured. Please try again later.');
      }
    );
  }

  deleteParticipantResult() {
    const header = new Headers({ Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token});
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
  };
    return this.http.post(this.userService.serverUrl + '/users/tree-test/delete', {id: this.tests[this.deleteParticipantResultIndex]._id}, httpOptions);
  }

  updateParticipantsTest(object){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
      })
    };
    return this.http.post(this.userService.serverUrl + '/users/tree-test/edit', object, httpOptions);
  }

  toggleIrrelevantItems() {
    this.irrelevantItemsCollapsed = !this.irrelevantItemsCollapsed;
  }

  irrelevantItemDisabled(item: TreeNode) {
    return this.irrelevantItemsCollapsed && !item.hasAnswerInPath();
  }

  retrievePaths() {
    const participants = [];
    for (const test of this.tests) {
      if (test.excluded) { continue; }
      const paths = [];
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

  retrievePath(clicks: any[]) {
    const startNode = this.treemap.findNodeById(clicks[0].id);
    const startPoint: PathPoint = {
      node: startNode,
      direction: 'start'
    };
    return [startPoint, ...startNode.retrievePath(clicks.slice(1))];
  }
}
