/* Shared puzzle rules. A move is one uninterrupted slide, any distance. */
(function(root){
 function moves(cars){
  const grid=Array(36).fill(-1);cars.forEach((c,i)=>{for(let k=0;k<c.n;k++)grid[(c.y+(c.o==='v'?k:0))*6+c.x+(c.o==='h'?k:0)]=i;});
  const out=[];cars.forEach((c,i)=>{for(const sign of [-1,1])for(let d=1;d<6;d++){
   const x=c.x+(c.o==='h'?(sign<0?-d:c.n-1+d):0),y=c.y+(c.o==='v'?(sign<0?-d:c.n-1+d):0);
   if(x<0||y<0||x>=6||y>=6||grid[y*6+x]!==-1)break;
   out.push({i,d:sign*d});
  }});return out;
 }
 function slide(cars,m){return cars.map((c,i)=>i===m.i?{...c,x:c.x+(c.o==='h'?m.d:0),y:c.y+(c.o==='v'?m.d:0)}:{...c});}
 function solve(cars,limit=100000){
  const key=s=>s.map(c=>c.o==='h'?c.x:c.y).join('');
  const queue=[{s:cars,p:-1,m:null}],seen=new Set([key(cars)]);
  for(let h=0;h<queue.length&&h<limit;h++){
   const q=queue[h];if(q.s[0].x===4){const path=[];let j=h;while(queue[j].p!==-1){path.push(queue[j].m);j=queue[j].p;}return path.reverse();}
   for(const m of moves(q.s)){const s=slide(q.s,m),k=key(s);if(!seen.has(k)){seen.add(k);queue.push({s,p:h,m});}}
  }return null;
 }
 root.Puzzle={moves,slide,solve};
})(typeof window==='undefined'?globalThis:window);
