const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');require('./engine.js');const ctx={window:{}};vm.runInNewContext(fs.readFileSync('levels.js','utf8'),ctx);const levels=ctx.window.LEVELS;
assert.equal(levels.length,10);
assert.equal(levels[0].par,3);
assert.equal(levels.at(-1).par,21);
for(let i=1;i<levels.length;i++)assert(levels[i].par>levels[i-1].par,'Each stop must require more moves than the previous stop');
for(const [i,level] of levels.entries()){
 const used=new Set();for(const c of level.cars){assert(['h','v'].includes(c.o));assert([2,3].includes(c.n));for(let k=0;k<c.n;k++){const x=c.x+(c.o==='h'?k:0),y=c.y+(c.o==='v'?k:0);assert(x>=0&&x<6&&y>=0&&y<6);assert(!used.has(y*6+x),'overlap');used.add(y*6+x);}}
 const path=Puzzle.solve(level.cars);assert(path);assert.equal(path.length,level.par);let state=level.cars;for(const m of level.solution){assert(Puzzle.moves(state).some(a=>a.i===m.i&&a.d===m.d));state=Puzzle.slide(state,m);}assert.equal(state[0].x,4);assert.equal(state[0].y,2);console.log(`Stop ${i+1}: valid, solvable, shortest route ${path.length} moves`);
}
const original=[{x:0,y:2,n:2,o:'h'},{x:2,y:1,n:3,o:'v'}];assert(!Puzzle.moves(original).some(m=>m.i===0));assert(!Puzzle.moves(original).some(m=>m.i===1&&m.d===-2));const changed=Puzzle.slide(original,{i:1,d:2});assert.equal(original[1].y,1);assert.equal(changed[1].y,3);console.log('Collision, board bounds, and immutable moves passed.');
