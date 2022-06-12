import Delaunator from 'delaunator'

function pathToPoints(path) {
  const points = []
  const pathArray = path.split(' ');
  for(let i = 0; i < pathArray.length/2; i++) {
    points.push(Number(pathArray[i*2+0]))
    points.push(Number(pathArray[i*2+1]))
  }
  return points
}

function nextHalfedge(e) { return (e % 3 === 2) ? e - 2 : e + 1; }
function forEachTriangleEdge(points, delaunay) {
  const _pathArray = []
  for (let e = 0; e < delaunay.triangles.length; e++) {
    if (e > delaunay.halfedges[e]) {
      const p = points[delaunay.triangles[e]];
      const q = points[delaunay.triangles[nextHalfedge(e)]];
      _pathArray.push(p)
      _pathArray.push(q)
    }
  }
  return _pathArray.join(" ")
}
const DOME_LEFT = '0 0 0 250 19 250 20 231.9 25.7 196.1 36.9 161.7 53.3 129.5 74.6 100.2 100.2 74.6 129.5 53.3 161.7 36.9 196.1 25.7 231.9 20 268.1 20';

const points = pathToPoints(DOME_LEFT)

const delaunay = new Delaunator(points);
console.log(delaunay.triangles);
const path = forEachTriangleEdge(points,delaunay)
console.log(path)
