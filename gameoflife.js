(function()
{
    var GRID_SQUARE_SIZE = 10;
    var GRID_COLUMNS = 50;
    var GRID_ROWS = 50;
    
    var CANVAS_WIDTH = GRID_SQUARE_SIZE*GRID_COLUMNS + 1;
    var CANVAS_HEIGHT = GRID_SQUARE_SIZE*GRID_ROWS + 1;
    
    
    
    var drawGrid = function(context)
    {
        context.lineWidth = 1;
        context.strokeStyle = "black";
        
        context.beginPath();
        
        /* when drawing, x and y doesn't represent the pixel index, but really
        coordinates in a grid => with a lineWidth=1, drawing a vertical line on
        x=3 will draw a 1px large line from 2.5 to 3.5 ; but it isn't possible
        to draw half a pixel, so a 2px large line between x=2 and x=4 will be
        filled, and because of that approximation the color will be half as dark
        as the specified stroke color */
        for(var i=0.5; i<CANVAS_WIDTH; i+=GRID_SQUARE_SIZE)
        {
            context.moveTo(i, 0);
            context.lineTo(i, CANVAS_HEIGHT);
        }
        
        for(var j=0.5; j<CANVAS_HEIGHT; j+=GRID_SQUARE_SIZE)
        {
            context.moveTo(0, j);
            context.lineTo(CANVAS_WIDTH, j);
        }
        
        context.stroke();
    };
    
    var drawSquare = function(context, i, j, color)
    {
        context.fillStyle = color || "black";
        context.fillRect(GRID_SQUARE_SIZE*i+1,
                         GRID_SQUARE_SIZE*j+1,
                         GRID_SQUARE_SIZE-1,
                         GRID_SQUARE_SIZE-1);
    };
    
    var drawCircle = function(context, i, j, color)
    {
        context.fillStyle = color || "black";
        context.beginPath();
        context.arc(GRID_SQUARE_SIZE*i+5.5, GRID_SQUARE_SIZE*j+5.5, 4.5, 0, 2*Math.PI, true);
        context.fill();
    };
    
    
    
    var canvas = document.getElementById("game");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    var ctx = canvas.getContext("2d");
    
    drawGrid(ctx);
    
    /*TODO
        - use an IEF for the klotski game (on github + website + backups)
        - define a world array
    */
    
    /*TODO
    - later, with a button/form, allow the user to draw square or circles, and depending on his choice, use a "var drawCell" that will be set either on drawSquare or drawCircle
    */
    
    
    
    
})();

