class Graph{
    constructor(points=[],segments=[]){
        this.points=points;
        this.segments=segments;
    }
    addPoint(point){
        this.points.push(point);
    }
    containsPoint(point){
        return this.points.find((p)=>p.equals(point));
    }
    tryAddPoint(point){
        if(!this.containsPoint(point)){
            this.addPoint(point);
        }
    }

    addSegment(segment){
        this.segments.push(segment);
    }

    containsSegment(segment){
        return this.segments.find((s)=>s.equals(segment));
    }

    tryAddSegment(segment){
        if(!this.containsSegment(segment)){
            this.addSegment(segment);
            return true;
        }
        return false;
    }

    draw(ctx){
        for(const seg of this.segments){
            seg.draw(ctx);
        }
        for(const pt of this.points){
            pt.draw(ctx);
        }
    }
}