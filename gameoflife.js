(function()
{
    var GRID_SQUARE_SIZE = 10;
    var GRID_COLUMNS = 70;
    var GRID_ROWS = 50;
    var RANDOM_CELLS = 10;
    
    
    
    
    
    var CANVAS_WIDTH = GRID_SQUARE_SIZE*GRID_COLUMNS + 1;
    var CANVAS_HEIGHT = GRID_SQUARE_SIZE*GRID_ROWS + 1;
    
    var world = [];
    var context;
    
    
    
    
    
    var createWorld = function()
    {
        for(var i=0; i<GRID_COLUMNS; i++)
        {
            var row = [];
            
            for(var j = 0; j<GRID_ROWS; j++)
            {
                row[j] = 0;
            }
            
            world[i] = row;
        }
    };
    
    var createRandomCells = function()
    {
        for(var i=0; i<RANDOM_CELLS; i++)
        {
            do
            {
                var column = Math.floor(Math.random() * GRID_COLUMNS);
                var row = Math.floor(Math.random() * GRID_ROWS);
            }
            while(world[column][row] == 1);
            
            world[column][row] = 1;
        }
    };
    
    var isCurrentStepCellAlive = function(i, j)
    {
        if (i < 0 || i >= GRID_COLUMNS
         || j < 0 || j >= GRID_ROWS
         || world[i][j] == 0)
        {
            return false;
        }
        
        if (world[i][j] == 1)
        {
            return true;
        }
    };
    
    var countCellAliveNeighbours = function(i, j)
    {
        var count = 0;
        
        if (isCurrentStepCellAlive(i-1, j-1)) {count++;}
        if (isCurrentStepCellAlive(i,   j-1)) {count++;}
        if (isCurrentStepCellAlive(i+1, j-1)) {count++;}
        if (isCurrentStepCellAlive(i-1, j)) {count++;}
        if (isCurrentStepCellAlive(i+1, j)) {count++;}
        if (isCurrentStepCellAlive(i-1, j+1)) {count++;}
        if (isCurrentStepCellAlive(i,   j+1)) {count++;}
        if (isCurrentStepCellAlive(i+1, j+1)) {count++;}
        
        return count;
    };
    
    var isNextStepCellAlive = function(i, j)
    {
        
    };
    
    var drawGrid = function()
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
    
    var drawSquare = function(i, j, color)
    {
        context.fillStyle = color || "black";
        context.fillRect(GRID_SQUARE_SIZE*i+1,
                         GRID_SQUARE_SIZE*j+1,
                         GRID_SQUARE_SIZE-1,
                         GRID_SQUARE_SIZE-1);
    };
    
    var drawCircle = function(i, j, color)
    {
        context.fillStyle = color || "black";
        context.beginPath();
        context.arc(GRID_SQUARE_SIZE*i+5.5, GRID_SQUARE_SIZE*j+5.5, 4.5, 0, 2*Math.PI, true);
        context.fill();
    };
    
    var drawCells = function()
    {
        for(var i=0; i<GRID_COLUMNS; i++)
        {
            for(var j=0; j<GRID_ROWS; j++)
            {
                if (world[i][j] == 1)
                {
                    drawSquare(i, j);
                }
            }
        }
    };
    
    
    
    
    
    var canvas = document.getElementById("game");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    context = canvas.getContext("2d");
    
    createWorld();
    world[10][10] = 1;
    createRandomCells();
    
    drawGrid();
    drawCells();
    
    
    
    /*TODO
        - main game of life loop
        - use an IEF for the klotski game (on github + website + backups)
        - later, with a button/form, allow the user to draw square or circles, and depending on his choice, use a "var drawCell" that will be set either on drawSquare or drawCircle
    */
})();

