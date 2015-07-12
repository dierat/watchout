var width = 600;
var height = 600;

var svg = d3.select('.gameboard')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .data( [{x:300,y:300}] );

var asteroidImage = svg.append('defs')
  .append('pattern')
  .attr('id', 'image')
  .attr('patternUnits', 'userSpaceOnUse')
  .attr('height', 20)
  .attr('width', 20)
  .append('image')
  .attr('width', 20)
  .attr('height', 20)
  .attr('xlink:href', 'rock.jpg');

var drag = d3.behavior.drag()
  .origin(function(d){return d;})
  .on('drag', dragmove);

var numAsteroids = 5;

var arr = [];
for (var i=0; i<numAsteroids; i++){
  arr.push(i);
}

// var player = svg.append('circle')
//   .attr('class', 'player')
//   .attr('r', '10')
//   .attr('cx', function(d){return d.x;})
//   .attr('cy', function(d){return d.y;})
//   .call(drag);

var player = svg.append('image')
  .attr('xlink:href', 'ship.gif')
  .attr('x', function(d){return d.x;})
  .attr('y', function(d){return d.y;})
  .attr('height', '20px')
  .attr('width', '20px')
  .attr('class', 'player')
  .call(drag);



var score = 0;
var highScore = 0;
var collided = false;
var currentCollisions = 0;

var scoreKeeper = function(){
  var high = d3.select('.high').select('span').text(highScore)
  var current = d3.select('.current').select('span').text(score)
  var collisions = d3.select('.collisions').select('span').text(currentCollisions)
};


var collide = function(d, i){ 
  return function(){
    var playerRadius = 10;
    var asteroidRadius = d3.select(this).attr("r");
    var playerX = Math.floor(+d3.select(".player").attr("x")) + 10;
    var playerY = Math.floor(+d3.select(".player").attr("y"))+10;
    var x = d3.select(this).attr("cx");
    var y = d3.select(this).attr("cy");
    var distanceX = playerX - x;
    var distanceY = playerY - y;
    var distance = Math.sqrt( (distanceX * distanceX) + (distanceY * distanceY) );
    if (distance < (+playerRadius + +asteroidRadius) ) {
      if(score > 0){
        currentCollisions++;
        d3.select('.player')
          .attr('xlink:href', 'explosion.gif')
          .attr('height', '50px')
          .attr('width', '50px')
          .transition()
          .delay(800)
          .duration(300)
          .attr('height', '20px')
          .attr('width', '20px')
          .attr('xlink:href', 'ship.gif');
      }
      collided = true;
      score = 0;
      arr = [];
      for (var i=0; i<numAsteroids; i++){
        arr.push(i);
      }
    }else{
      collided = false;
    }
  };
};



function dragmove(d) {
 d3.select(this)
  .attr('x', d.x = d3.event.x)
  .attr("y", d.y = d3.event.y); 
}

var flyingAsteroids = function(array){
  var circle = svg.selectAll('.asteroid').data(array);

  circle.exit()
    .transition()
    .duration(1000)
    .style("fill-opacity",1e-6)
  .remove();

  circle.enter()
    .append('circle')
    .attr('class', 'asteroid')
    .attr('r', 5)
    .attr('cx', function(d, i){
      return Math.floor(Math.random() * width);
    })
    .attr('cy', function(d, i){
      return Math.floor(Math.random() * height);
    })
    .attr('fill', 'url(#image)')
    .style('opacity', 0);
    

  circle
    .transition()
    .duration(1500)
    .style('opacity', 1)
    .attr('cx', function(d, i){
      return Math.floor(Math.random() * width);
    })
    .attr('cy', function(d, i){
      return Math.floor(Math.random() * height);
    })
    .tween("collide",collide);
};



setInterval(function(){
  flyingAsteroids(arr);
}, 1000);

setInterval(function(){
  if(!collided){
    score++;
    if(score > highScore){
      highScore = score;
    }
  }
}, 100);

setInterval(function(){
  scoreKeeper();
}, 100);



setInterval(function(){
  arr.push(0);
}, 3000);
