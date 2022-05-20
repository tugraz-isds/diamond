import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

import { UserService } from '../user.service';

import * as svg from 'save-svg-as-png';
import * as d3 from "d3";

@Component({
  selector: 'app-pietree',
  templateUrl: './pietree.component.html',
  styleUrls: ['./pietree.component.css']
})
export class PietreeComponent implements OnInit {

  id = this.route.snapshot.params['id'];
  index = this.route.snapshot.params['index'];

  test;
  results = [];
  tree = [];
  nodeEnter;
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {
    if (this.id && this.index) {
      this.resultsInformation()
        .subscribe(
          res => {
            this.results = (<any>res).result;
            for (let i = 0; i < this.results.length; i++) {
              this.results[i]["include"] = true;
            }
            this.test = (<any>res).test[0];
            this.tree = (<any>res).test[0].tree;
            this.preparePieTree(this.index);
          },
          err => {
            console.log(err);
          }
        );
    } else {
      this.router.navigate(['tests']);
    }
  }

  resultsInformation() {
    const httpOptions = {
        headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
  };
    return this.http.post(this.userService.serverUrl + '/users/results/' + this.id, "", httpOptions);
  }

  preparePieTree(index) {
    
    var data = this.getPieTreeData(index);

    var width = 450;
    var height = 360;

    // append the svg object to the body of the page
    var svg = d3.select("#pietreesvg")
      .append("svg")
      .attr("viewBox", "-20 0 " + width + " " + height )
        .attr('preserveAspectRatio', 'xMinYMin')
        .attr("id", "mysvg")
      .append("g")
        

      // Create the cluster layout:
      var cluster = d3.cluster()
        .size([height, width - 100]);  // 100 is the margin I will have on the right side

      // Give the data to this cluster layout:
      var root = d3.hierarchy(data);
      cluster(root);


      // Add the links between nodes:
      svg.selectAll('path')
        .data( root.descendants().slice(1) )
        .enter()
        .append('path')
        .attr("d", function(d) {
            return "M" + (<any>d).y + "," + (<any>d).x
                    + "C" + ((<any>d).parent.y + 50) + "," + (<any>d).x
                    + " " + ((<any>d).parent.y + 150) + "," + (<any>d).parent.x
                    + " " + (<any>d).parent.y + "," + (<any>d).parent.x;
                  })
        .style("fill", 'none')
        .attr("stroke", (d) => {
          return this.getColor(d)
        })
        .attr("stroke-width", (d) => {
          return this.getWidth(d)
        })


  var node = svg.selectAll('g')
  .data(root.descendants());

  var nodeEnter = node.enter().append('g')

  .attr("transform", function(d) {
    return "translate(" + (<any>d).y + "," + (<any>d).x + ")"
  })

  // Add Circle for the nodes
  nodeEnter.append('circle')
  .attr("r", 7)
  .style("fill", (d) => {
    return this.getColor(d)
  })
  .attr("stroke", "black")
  .style("stroke-width", 1)

  // Add labels for the nodes
  nodeEnter.append('text')
    .attr("dy", "-10px")
    .attr("x", "12px")
    .style("font-size", "6px")
    .attr("text-anchor", "middle")
    .text(function(d) { return d.data.name + " (" + (<any>d).data.clicks + ")" });


  this.getSvg();
  }
  getWidth(node) {
    return node.data.clicks/1.5 + "px";
  }

  getColor(node) {
    let currentId = this.test.tasks[this.index].id; //correct answer
    if (node.data.id === currentId) return "green";
    while (currentId !== "root") {
      for (let k = 0; k < this.tree.length; k++) {
        if (this.tree[k].id === currentId) {
          currentId = this.tree[k].parent;
          if (currentId === node.data.id) {
            return "green";
          }
          if (currentId === "root"){
            return "lightgray";
          }
        }
      }
    }
    return "green";

  }

  getPieTreeData(taskIndex) {
    // go through each participant
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].finished) {
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
        for (let k = 0; k < this.tree.length; k++) {
          if (this.tree[k].id === this.results[i].results[taskIndex].answer) {
            this.tree[k]["clicked"] = true;
            if (this.tree[k]["clickNumbers"]) {
              this.tree[k]["clickNumbers"] += 1;
            } else {
            this.tree[k]["clickNumbers"] = 1;
            }
            break;
          }
        }
      }
    }

    let newTree = [];

    for (let k = 0; k < this.tree.length; k++) {
      if (this.tree[k].clicked) {
        newTree.push({
          "name": this.tree[k].text,
          "parent": this.tree[k].parent,
          "id": this.tree[k].id,
          "clicks": this.tree[k].clickNumbers
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
}

}
