(function()
{
    /*TODO
        - use an IEF for the klotski game (on github + website + backups)
        - define a world array
        - create a function that draw a circle, or a square, in a specified color,
          inside the (i,j) square specified
        - finish reading Mozilla canvas tutorial
          https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial/Using_images
    */
    
    var canvas = document.getElementById("game");
    canvas.width = 640;
    canvas.height = 480;
    
    var ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "black";
    ctx.fillRect(10, 10, 50, 50);
    
    ctx.strokeStyle = "silver";
    ctx.beginPath();
    for(var i=10; i<640; i+=10)
    {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 480);
    }
    for(var j=10; j<480; j+=10)
    {
        ctx.moveTo(0, j);
        ctx.lineTo(640, j);
    }
    ctx.stroke();
    
    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.arc(320, 240, 50, 0, 2*Math.PI, true);
    ctx.stroke();
    
})();

