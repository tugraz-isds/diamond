import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpHeaders} from '@angular/common/http';

import {UserService} from '../../user.service';

import * as svg from 'save-svg-as-png';
import * as d3 from "d3";
import PathTreeGenerator from "./PathTreeGenerator";

@Component({
    selector: 'app-pathtree',
    templateUrl: './pathtree.component.html',
    styleUrls: ['./pathtree.component.css']
})
export class PathtreeComponent implements OnInit {

    @Input()  margin = {top: 20, right: 100, bottom: 20, left: 30};
    @Input()  fontSize = 10;
    @Input()  showMarginBorders = true;
    @Input()  flipped: boolean;
    @Input()  nodeDistribution = 360;
    nodeDistributionDisplay = Math.floor(this.nodeDistribution / 3.6);

    id = this.route.snapshot.params['id'];
    index = this.route.snapshot.params['index'];

    test;
    results = [];
    tree = [];
    nodeEnter;
    private newTree: any[];
    constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private userService: UserService) {
    }

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
                        this.preparePathTreeData(this.index);
                        this.preparePathTree(this.index);
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
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('currentUser'))).token
            })
        };
        return this.http.post(this.userService.serverUrl + '/users/tree-tests/' + this.id, "", httpOptions);
    }

    preparePathTree(index) {
        const data = this.getPathTreeData(index);
        const pathTreeGenerator = new PathTreeGenerator(
            {data, margin: this.margin, fontSize: this.fontSize,
                showMarginBorders: this.showMarginBorders, flipped: this.flipped, angle: this.nodeDistribution});
        pathTreeGenerator.addSvgToDOM();
        pathTreeGenerator.addMarginBorders();
        pathTreeGenerator.addLinksToDOM(this.test, this.index, this.tree);
        pathTreeGenerator.addNodesToDOM();
        pathTreeGenerator.addCirclesToDOM(this.test, this.index, this.tree);

        this.getSvg();
    }

    preparePathTreeData(taskIndex) {
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
        this.newTree = newTree;
    }

    getPathTreeData(taskIndex) {
        return {
            "name": this.tree[0].text,
            "children": this.getNestedChildren(this.newTree, "root")
        };
    }

    getNestedChildren(arr, parent) {
        var out = [];
        for (var i in arr) {
            if (arr[i].parent == parent) {
                var children = this.getNestedChildren(arr, arr[i].id)

                if (children.length) {
                    arr[i].children = children
                }
                out.push(arr[i]);
            }
        }
        return out
    }

    removeKeys(obj, keys) {
        var index;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                switch (typeof (obj[prop])) {
                    case 'string':
                        index = keys.indexOf(prop);
                        if (index > -1) {
                            delete obj[prop];
                        }
                        break;
                    case 'object':
                        index = keys.indexOf(prop);
                        if (index > -1) {
                            delete obj[prop];
                        } else {
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
        const clone = svg.cloneNode(true);
        if (this.showMarginBorders) {               //remove borders from downloaded svg
            clone.removeChild(clone.childNodes[1]); //remove first border rect
            clone.removeChild(clone.childNodes[1]); //remove second border rect which has index 1 now
        }


        //get svg source.
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(clone);

        //add name spaces.
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        //convert svg source to URI data scheme.
        var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

        //set url value to a element's href attribute.
        (<any>document).getElementById("link").href = url;
    }

    onMarginChange(e: any) {
        switch (e.target.id) {
            case "margin-top" : this.margin = this.margin = {...this.margin, top: Number(e.target.value)}; break;
            case "margin-right" : this.margin = this.margin = {...this.margin, right: Number(e.target.value)}; break;
            case "margin-bottom" : this.margin = this.margin = {...this.margin, bottom: Number(e.target.value)}; break;
            case "margin-left" : this.margin = this.margin = {...this.margin, left: Number(e.target.value)}; break;
        }
        this.preparePathTree(this.index);
    }

    onFontSizeChange(e: any) {
        this.fontSize = Number(e.target.value);
        this.preparePathTree(this.index);
    }

    onShowMarginBorders(e: any) {
        this.showMarginBorders = e.target.checked;
        this.preparePathTree(this.index);
    }

    onFlipped(e: any) {
        this.flipped = e.target.checked;
        this.preparePathTree(this.index);
    }

    onNodeDistribution(e: any) {
        this.nodeDistribution = e.target.value;
        this.nodeDistributionDisplay = Math.floor(this.nodeDistribution / 3.6);
        this.preparePathTree(this.index);
    }
}
