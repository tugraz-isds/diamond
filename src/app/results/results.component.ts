import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

declare var Chart: any;
import * as d3 from "d3";

declare var $: any;

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css', '../app.component.css']
})
export class ResultsComponent implements OnInit {

  // tslint:disable-next-line:no-string-literal
  id = this.route.snapshot.params['id'];
  results = [];
  test;
  numberCompleted = 0;
  numberLeft = 0;

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
  treemap;
  root;
  svg;
  duration = 750;
  i = 0;
  deleteParticipantResultIndex;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {
    $('[data-toggle="tooltip"]').tooltip();
    if (this.id) {
      this.resultsInformation()
        .subscribe(
          res => {
            this.results = (<any>res).result;
            for (let i = 0; i < this.results.length; i++) {
              this.results[i]["exclude"] = false;
            }
            this.test = (<any>res).test[0];
            this.tree = (<any>res).test[0].tree;
            this.prepareResults();
          },
          err => {
            console.log(err);
          }
        );
    } else {
      this.router.navigate(['tests']);
    }
  }

  openPieTree(index) {
    let url = location.origin + "/#/pie-tree/" + this.id + "/" + index;
    window.open(url, "_blank");
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
      })
  };
  // return this.http.post('http://localhost:48792/users/results/' + 
    return this.http.post(this.userService.serverUrl + '/users/results/' + this.id, "", httpOptions);
  }

  getIncludeResultNumber() {
    let inc = 0;
    for (let i = 0; i < this.results.length; i++) {
      if (!this.results[i].exclude) inc++;
    }
    return inc;
  }

  prepareResults() {
    let currentTime = 0;


    this.numberCompleted = 0;
    this.numberLeft = 0;

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



    for (let i = 0; i < this.results.length; i++) {
      if (!this.results[i].exclude) {
        if (this.results[i].finished) this.numberCompleted++;
        else this.numberLeft++;
        for (let j = 0; j < this.results[i].results.length; j++) {
          this.totalSecondsTaken += this.results[i].results[j].time;
          currentTime += this.results[i].results[j].time;
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
    let tasks = [];
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
    for (let i = 0; i < this.test.tasks.length; i++) {
      // go through every participant
      for (let j = 0; j < this.results.length; j++) {
        if (this.results[j] && !this.results[j].exclude) {
          if (this.results[j].results[i]) {

            if (this.results[j].results[i].time < minTime) {
              minTime = this.results[j].results[i].time;
            }

            if (this.results[j].results[i].time > maxTime) {
              maxTime = this.results[j].results[i].time;
            }

            time += this.results[j].results[i].time;
            if (!this.results[j].results[i].answer) {
              skipped++;
            } else {
              if (!this.isBackTracking(this.results[j].results[i].clicks)) {
                if (this.results[j].results[i].answer && this.results[j].results[i].answer === this.test.tasks[i].id) { // it is correct
                  directSuccess++;
                } else { // it is incorrect
                  directFailure++;
                }
              } else { //backtracking 
                if (this.results[j].results[i].answer && this.results[j].results[i].answer === this.test.tasks[i].id) { // it is correct
                  indirectSuccess++;
                } else { // it is incorrect
                  indirectFailure++;

                }
              }
            }
          }
        }
      }
      (<any>task).skipped = skipped;
      (<any>task).directSuccess = directSuccess;
      (<any>task).indirectSuccess = indirectSuccess;
      (<any>task).directFailure = directFailure;
      (<any>task).indirectFailure = indirectFailure;

      (<any>task).minTime = minTime;
      (<any>task).maxTime = maxTime;

      let percentageDirect = Math.round((directSuccess + directFailure)*100 / this.results.length * 100) / 100;
      let percentageCorrect = Math.round((directSuccess + indirectSuccess)*100 / this.results.length * 100) / 100;

      (<any>task).percentageDirect = percentageDirect;
      (<any>task).percentageCorrect = percentageCorrect;


      let averageTime = Math.round(time / this.results.length * 100) / 100;

      (<any>task).averageTime = averageTime;

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

  preparePieTree(index) {
    
    var data = this.getPieTreeData(index);
    data = this.removeKeys(data, ["parent", "id"]);

    // set the dimensions and margins of the graph
    var width = 460;
    var height = 460;

    // append the svg object to the body of the page
    var svg = d3.select("#pietreesvg")
      .append("svg")
        .attr('viewBox','-70 0 900 900')
        .attr('preserveAspectRatio', 'xMinYMin')
        .attr("id", "mysvg")
      .append("g")
        

      // Create the cluster layout:
      var cluster = d3.cluster()
        .size([height, width - 100]);  // 100 is the margin I will have on the right side

      // Give the data to this cluster layout:
      var root = d3.hierarchy(data);
      cluster(root);


  // worked with text
  var node = svg.selectAll('g')
  .data(root.descendants());

// Enter any new modes at the parent's previous position.
var nodeEnter = node.enter().append('g')

// Add Circle for the nodes
nodeEnter.append('circle')
.attr("r", 7)
.style("fill", "#69b3a2")
.attr("stroke", "black")
.style("stroke-width", 2)

// Add labels for the nodes
nodeEnter.append('text')
  .attr("dy", ".35em")
  .attr("x", function(d) {
      return d.children || d.children ? -13 : 13;
  })
  .attr("text-anchor", function(d) {
      return d.children || d.children ? "end" : "start";
  })
  .text(function(d) { return d.data.name; });

  }

  getPieTreeData(taskIndex) {

    // go through each participant
    for (let i = 0; i < this.results.length; i++) {
      // go through given task clicks
      for (let j = 0; j < this.results[i].results[taskIndex].clicks.length; j++) {

        for (let k = 0; k < this.tree.length; k++) {
          if (this.tree[k].id === this.results[i].results[taskIndex].clicks[j].id) {
            this.tree[k]["name"] = this.tree[k]["text"];
            if (!this.tree[k]["clicked"]) {
              this.tree[k]["clicked"] = true;
              this.tree[k]["clickNumbers"] = 1;
            } else {
              this.tree[k]["clickNumbers"]++;
            }

          }
        }
      }
    }

    let newTree = [];

    for (let k = 0; k < this.tree.length; k++) {
      if (this.tree[k].clicked) {
        //newTree.push(this.tree[k]);
        newTree.push({
          "name": this.tree[k].text,
          "parent": this.tree[k].parent,
          "id": this.tree[k].id
        });
      }
    }

    var data = {
      "name": this.tree[0].text,
      "children": this.getNestedChildren(newTree, "root")
    };

      return data;
  }

  getNestedChildren(arr, parent) {
    var out = []
    for(var i in arr) {
        if(arr[i].parent == parent) {
            var children = this.getNestedChildren(arr, arr[i].id)

            if(children.length) {
                arr[i].children = children
            }
            out.push(arr[i]);
        }
    }
    return out
}

removeKeys(obj, keys){
  var index;
  for (var prop in obj) {
      // important check that this is objects own property
      // not from prototype prop inherited
      if(obj.hasOwnProperty(prop)){
          switch(typeof(obj[prop])){
              case 'string':
                  index = keys.indexOf(prop);
                  if(index > -1){
                      delete obj[prop];
                  }
                  break;
              case 'object':
                  index = keys.indexOf(prop);
                  if(index > -1){
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
    if (!results.length) return "0%";
    for (let i = 0; i < results.length; i++) {
      if (results[i].answer && results[i].answer === this.test.tasks[i].id) {
        totalCorrect++;
      }
    }
    let percentage = (totalCorrect * 100) / this.test.tasks.length;

    return Math.floor(percentage) + "%";
  }

  getSkippedTasks(results) {
    let totalSkipped = 0;;
    if (!results.length) return "0%";
    for (let i = 0; i < results.length; i++) {
      if (!results[i].answer) {
        totalSkipped++;
      }
    }
    let percentage = (totalSkipped * 100) / this.tasks.length;

    return Math.floor(percentage) + "%";
  }

  getCompletedTasks(results) {
    let totalCompleted = 0;;
    if (!results.length) return "0%";
    for (let i = 0; i < results.length; i++) {
      if (results[i].answer) {
        totalCompleted++;
      }
    }
    let percentage = (totalCompleted * 100) / this.tasks.length;

    return Math.floor(percentage) + "%";
  }

  getDuration(results) {
    if (!results.finished) {
      return "Abandoned";
    }
    let totalSeconds = 0;
    let totalMinutes = 0;
    let totalHours = 0;
    for (let i = 0; i < results.results.length; i++) {
      totalSeconds += results.results[i].time;
    }
    return Math.floor(totalSeconds);
  }

  getBackgroundColor(taskIndex, treeItemIndex, number, answer) {
    if (this.test.tasks[taskIndex].id === answer) {
      return "rgba(161,212,36,0.7)";
    }
    var totalNumberOfAnswers = 0;
    // go through every result
    for (let i = 0; i < this.results.length; i++) {
        if (this.results[i].results[taskIndex]) {
          totalNumberOfAnswers++;
        }
    }

    var percentage = (number * 100) / totalNumberOfAnswers;
    if (percentage >=20) { return "rgba(218,31,71,0.7)"; }

    return "rgba(245,98,0,0.7)";
  }

  destinationTable() {
    this.destinations = [];
    let destination = [];
    
    // go through every task
    for (let k = 0; k < this.test.tasks.length; k++) { 
      // go through every result
      for (let i = 0; i < this.results.length; i++) {
        if (!this.results[i].exclude) {
          if (this.results[i].results[k]) {
            if (!destination[this.results[i].results[k].answer]) {
              destination[this.results[i].results[k].answer] = 1;
            } else {
              destination[this.results[i].results[k].answer]++;
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
      if (clicks[k].parent !== clicks[k-1].id ) {
        return true;
      }
    }
    return false;
  }

  getTaskResults() {
    let backtracking = false;
    for (let i = 0; i < this.results.length; i++) {
      if (!this.results[i].exclude) {
        for (let j = 0; j < this.results[i].results.length; j++) {
          this.totalTasksDone++;
          if (this.test.tasks[j] && this.results[i].results[j].answer && this.results[i].results[j].answer === this.test.tasks[j].id) {
            this.totalTasksCorrect++;
          }

          // check directness
          if (this.results[i].results[j].clicks.length < 2) {
            this.totalTasksDirect++;
          } else {
            for (let k = 1; k < this.results[i].results[j].clicks.length; k++) {
              if (this.results[i].results[j].clicks[k].parent !== this.results[i].results[j].clicks[k-1].id ) {
                backtracking = true;
                //k = this.results[i].results[j].clicks.length;
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
    //get svg element.
    var svg = document.getElementById("mysvg");

    //get svg source.
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg);

    //add name spaces.
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    //add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    //convert svg source to URI data scheme.
    var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

    //set url value to a element's href attribute.
    (<any>document).getElementById("link").href = url;
    //you can download svg file by right click menu.
  }

  exportCSV() {
    let rows = [];
    for (let i = 0; i < this.results.length; i++) {
      if (!this.results[i].exclude) {
        let item = [
          this.results[i].username, 
          this.results[i].timestamp, 
          this.getDuration(this.results[i]),
          this.getCompletedTasks(this.results[i].results),
          this.getSkippedTasks(this.results[i].results),
          this.getCorrectTasks(this.results[i].results),
          this.results[i].feedback
        ]
        rows.push(item);
      }
    }
  
    let csvContent = "data:text/csv;charset=utf-8," 
       + rows.map(e => e.join(",")).join("\n");

       var encodedUri = encodeURI(csvContent);
       var link = document.createElement("a");
       link.setAttribute("href", encodedUri);
       link.setAttribute("download", "my_data.csv");
       document.body.appendChild(link); // Required for FF
       
       link.click(); // This will download the data file named "my_data.csv".
  }

  exportDestinationsCSV() {
    let rows = [];
    let item = [""];
    for (let t = 1; t <= this.test.tasks.length; t++) {
      item.push(t.toString());
    }
    rows.push(item);

    for (let i = 0; i < this.tree.length; i++) {
      let item = [];
      if (this.tree[i].data) {
        for (let j = 0; j < this.tree[i].data.index; j++) {
          item.push("");
        }
      }
      item.push(this.tree[i].text);

      for (let k = 0; k < this.destinations.length; k++) {
        item.push(this.destinations[k][this.tree[i].id]);
      }
      rows.push(item);
    }
  
    let csvContent = "data:text/csv;charset=utf-8," 
       + rows.map(e => e.join(",")).join("\n");

       var encodedUri = encodeURI(csvContent);
       var link = document.createElement("a");
       link.setAttribute("href", encodedUri);
       link.setAttribute("download", "my_data.csv");
       document.body.appendChild(link); // Required for FF
       
       link.click(); // This will download the data file named "my_data.csv".
  }

  prepareDeleteParticipantResult() {
    console.log("prepared!!");
    console.log(this.results);
    this.deleteParticipantResult()
    .subscribe(
      res => {
        this.resultsInformation()
        .subscribe(
          res => {
            this.results = (<any>res).result;
            for (let i = 0; i < this.results.length; i++) {
              this.results[i]["exclude"] = false;
            }
            this.test = (<any>res).test[0];
            this.tree = (<any>res).test[0].tree;
            this.prepareResults();
          },
          err => {
            console.log(err);
          }
        );
        $("#myModal10").modal('hide');
      },
      err => {
        $("#myModal10").modal('hide');
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
  //http://localhost:48792
    return this.http.post(this.userService.serverUrl + '/users/result/delete', {id: this.results[this.deleteParticipantResultIndex]._id}, httpOptions);
  }
}
