import * as d3 from "d3";

interface PathTreeGeneratorOptions {
    radius?: number;
    angle?: number;
    data: any;
    margin?: {
        top: number,
        right: number,
        bottom: number,
        left: number
    };
    fontSize?: number;
    circleRadius?: number;
    circleStroke?: number;
    showMarginBorders?: boolean;
    flipped?: boolean;
}

export default class PathTreeGenerator {
    private radius = 0;
    private angle = 0;
    private data: any;
    private maxClicks = 0;
    private margin = {top: 0, right: 0, bottom: 0, left: 0};
    private fontSize = 0;
    private showMarginBorders = true;
    private flipped = false;
    private circleRadius = 0;
    private circleStroke = 0;
    private root: d3.HierarchyNode<any>;
    private clusterLayout: d3.HierarchyPointNode<unknown>;
    private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
    private boundary: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    // private PathTreeComponentRef:
    private enteredNodes: d3.Selection<SVGGElement, d3.HierarchyNode<any>, SVGGElement, unknown>;
    constructor(options: PathTreeGeneratorOptions) {
        const {radius = 450, angle = 360, data, circleRadius = 7, circleStroke = 1,
            margin = {top: 20, left: 30, bottom: 20, right: 100}, fontSize = 7, showMarginBorders = true, flipped} = options;
        this.radius = radius;
        this.angle = angle;
        this.data = data;
        this.margin = margin;
        this.fontSize = fontSize;
        this.flipped = flipped;
        this.showMarginBorders = showMarginBorders;
        this.circleRadius = circleRadius;
        this.circleStroke = circleStroke;
        this.maxClicks = Math.max(...data.children.map(child => child.clicks));
        this.createHierarchy();
    }

    private retrieveBoundaries() {
        let minX = 0;
        let minY = 0;
        let maxX = 0;
        let maxY = 0;

        this.clusterLayout.descendants().forEach(layoutNode => { // switch from vertical to horizontal
            minX = this.flipped ? (minX < layoutNode.x ? minX : layoutNode.x) : (minX < layoutNode.y ? minX : layoutNode.y);
            maxX = this.flipped ? (maxX > layoutNode.x ? maxX : layoutNode.x) : (maxX > layoutNode.y ? maxX : layoutNode.y);
            minY = this.flipped ? (minY < layoutNode.y ? minY : layoutNode.y) : (minY < layoutNode.x ? minY : layoutNode.x);
            maxY = this.flipped ? (maxY > layoutNode.y ? maxY : layoutNode.y) : (maxY > layoutNode.x ? maxY : layoutNode.x);
        });

        const width = maxX - minX + this.margin.left + this.margin.right + 2 * this.circleRadius + 2 * this.circleStroke;
        const height = maxY - minY + this.margin.top + this.margin.bottom + 2 * this.circleRadius + 2 * this.circleStroke;
        return {minX, minY, maxX, maxY, width, height};
    }

    private createHierarchy() {
        // Create the cluster layout:
        const cluster = d3.cluster().size([this.angle, this.radius]);

        // Give the data to this cluster layout:
        this.root = d3.hierarchy(this.data);
        this.clusterLayout = cluster(this.root);
    }

    public addSvgToDOM() {
        // append the svg object to the body of the page
        const container = document.getElementById("pathtreesvg");
        if (container?.firstChild) {
            container.removeChild(container.firstChild);
        }

        const {width, height} = this.retrieveBoundaries();
        this.svg = d3.select("#pathtreesvg")
            .append("svg")
            .attr("viewBox", `${0} ${0} ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMinYMin')
            .attr("id", "mysvg");
        this.boundary = this.svg.append("g")
            .attr("transform", `translate(${this.margin.left} ${this.margin.top})`);
    }

    public addMarginBorders() {
        if (!this.showMarginBorders) return;
        const {width, height, minX, minY, maxX, maxY} = this.retrieveBoundaries();
        const strokeWidth = 2;
        this.svg.append("rect")
            .attr("x", strokeWidth / 2)
            .attr("y", strokeWidth / 2)
            .attr("width", width - 2 * strokeWidth / 2)
            .attr("height", height - 2 * strokeWidth / 2)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", "2");

        this.svg.append("rect")
            .attr("x", minX)
            .attr("y", minY)
            .attr("width", width - this.margin.left - this.margin.right)
            .attr("height", height - this.margin.top - this.margin.bottom)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", "2")
            .attr("transform", `translate(${this.margin.left} ${this.margin.top})`);
    }

    public addLinksToDOM(test, index, tree) {
        const {minY} = this.retrieveBoundaries();

        // "M" + this.finalPositionX((<any>d).x) + "," + this.finalPositionY((<any>d).y, minY)
        // + "C" + (this.finalPositionX((<any>d).parent.x)) + "," + (this.finalPositionY((<any>d).y, minY))
        // + " " + (this.finalPositionX((<any>d).parent.x)) + "," + (this.finalPositionY((<any>d).parent.y, minY))
        // + " " + (this.finalPositionX((<any>d).parent.x) + "," + this.finalPositionY((<any>d).parent.y, minY));

        const pathCallback = (d) => {
            return "M" + this.finalPositionX((<any>d).y) + "," + this.finalPositionY((<any>d).x, minY)
                + "C" + (this.finalPositionX((<any>d).parent.y) + 50) + "," + (this.finalPositionY((<any>d).x, minY))
                + " " + (this.finalPositionX((<any>d).parent.y) + 150) + "," + (this.finalPositionY((<any>d).parent.x, minY))
                + " " + (this.finalPositionX((<any>d).parent.y) + "," + this.finalPositionY((<any>d).parent.x, minY));
        };

        const lines = this.boundary.selectAll('path')
            .data( this.root.descendants().slice(1) )
            .enter()
            .append( this.flipped ? "line" : 'path');

        if (this.flipped) {
            lines.attr("x1", (d) => this.finalPositionX((<any>d).x))
            .attr("y1", (d) => this.finalPositionY((<any>d).y, minY))
            .attr("x2", (d) => this.finalPositionX((<any>d).parent.x))
            .attr("y2", (d) => this.finalPositionY((<any>d).parent.y, minY));
        } else lines.attr("d", pathCallback);

       lines.style("fill", 'none')
            .attr("stroke", (d) => {
                return this.getColor(d, test, index, tree);
            })
            .attr("stroke-width", (d) => {
                return this.getWidth(d);
            })
            .attr("opacity", (d) => {
                return d.data.clicks / this.maxClicks * 1.5 + 0.25;
            })
        ;
    }

    public addNodesToDOM() {
        const {minY} = this.retrieveBoundaries();

        const node = this.boundary.selectAll('g')
            .data(this.root.descendants());
        this.enteredNodes = node.enter().append('g')
            .attr("transform", (d) => {
                // console.log(d)
                return "translate(" + this.finalPositionX(this.flipped ? (<any>d).x : (<any>d).y) +
                    "," + this.finalPositionY(this.flipped ? (<any>d).y : (<any>d).x, minY) + ")"
            });
    }

    public addCirclesToDOM(test, index, tree) {
        this.enteredNodes.append('circle')
            .attr("r", this.circleRadius)
            .style("fill", (d) => {
                return this.getColor(d, test, index, tree);
            })
            .attr("stroke", "black")
            .style("stroke-width", this.circleStroke);

        // Add labels for the nodes
        this.enteredNodes.append('text')
            .attr("dy", "-10")
            .attr("x", "12")
            .attr("font-size", this.fontSize.toString())
            .attr("text-anchor", "middle")
            .text((d) => {
                const clicks = (<any>d).data.clicks !== undefined ? (<any>d).data.clicks : 0;
                return d.data.name + " (" + clicks + ")"
            });


    }

    private getColor(node, test, index, tree) {
        let currentId = test.tasks[index].id; //correct answer
        if (node.data.id === currentId) return "green";
        while (currentId !== "root") {
            for (let k = 0; k < tree.length; k++) {
                if (tree[k].id === currentId) {
                    currentId = tree[k].parent;
                    if (currentId === node.data.id) {
                        return "green";
                    }
                    if (currentId === "root") {
                        return "lightgray";
                    }
                }
            }
        }
        return "green";

    }

    private getWidth(node) {
        const maxLog = this.maxClicks;
        const valLog = node.data.clicks;
        const variableStrokeWidth = 10;
        const minStrokeWidth = 2;
        return (valLog / maxLog * variableStrokeWidth + minStrokeWidth).toString();
    }

    private finalPositionX(positionX: number) { return positionX + this.circleRadius + this.circleStroke; }
    private finalPositionY(positionY: number, minY: number) { return positionY + this.circleRadius + this.circleStroke - minY; }
}
