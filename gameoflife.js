(function()
{
    var GRID_SQUARE_SIZE = 10;
    var GRID_COLUMNS = 70;
    var GRID_ROWS = 50;
    var RANDOM_CELLS = 300;
    
    
    
    var CANVAS_WIDTH = GRID_SQUARE_SIZE*GRID_COLUMNS + 1;
    var CANVAS_HEIGHT = GRID_SQUARE_SIZE*GRID_ROWS + 1;
    
    var context;
    var world = [];
    var settings =
    {
        grid: undefined,
        randomcells: undefined,
        drawfunction: undefined
    };
    
    
    
    var createWorld = function()
    {
        for(var i=0; i<GRID_COLUMNS; i++)
        {
            var row = [];
            
            for(var j = 0; j<GRID_ROWS; j++)
            {
                row[j] = {current: 0, next: 0};
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
            while(world[column][row].current == 1);
            
            world[column][row] = {current: 1, next: 0};
        }
    };
    
    var isCurrentStepCellAlive = function(i, j)
    {
        if (i < 0 || i >= GRID_COLUMNS
         || j < 0 || j >= GRID_ROWS
         || world[i][j].current == 0)
        {
            return false;
        }
        
        if (world[i][j].current == 1)
        {
            return true;
        }
        
        return false;
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
        if (world[i][j].current == 0)
        {
            var neighbours = countCellAliveNeighbours(i,j);
            return (neighbours == 3) ? true : false;
        }
        
        if (world[i][j].current == 1)
        {
            var neighbours = countCellAliveNeighbours(i,j);
            return (neighbours == 2 || neighbours == 3) ? true : false;
        }
        
        return false;
    };
    
    var drawGrid = function()
    {
        context.fillStyle = "white";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        if (!settings.grid)
            return;
        
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
        context.fillStyle = color || "gray";
        context.fillRect(GRID_SQUARE_SIZE*i+1,
                         GRID_SQUARE_SIZE*j+1,
                         GRID_SQUARE_SIZE-1,
                         GRID_SQUARE_SIZE-1);
    };
    
    var drawCircle = function(i, j, color)
    {
        context.fillStyle = color || "gray";
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
                if (world[i][j].current == 1)
                {
                    //drawSquare(i, j);
                    settings.drawfunction(i, j);
                    //drawfunction(i, j);
                }
            }
        }
    };
    
    var gameloop = function()
    {
        /* TODO: 2 double-for here, could be improved with a 3-properties world[][] ?
            world[][].now1 / .now2 / .now3
            => 1 double-for with current="now1", next="now2", tmp="now3" : 
            
                if (isNextStepCellAlive(i,j))
                {
                    world[i][j][next] = 1;
                }
                world[i][j][tmp] = 0;
                // + make sure drawCells() know that now2 contains the values to use
            
            next step, with current = "now2", next = "now3", tmp = "now1" : ...
            use an integer to know the step and know wich now has to be used for what
            => benchmark with performance.now() ?
        */
        
        for(var i=0; i<GRID_COLUMNS; i++)
        {
            for(var j=0; j<GRID_ROWS; j++)
            {
                if (isNextStepCellAlive(i,j))
                {
                    world[i][j].next = 1;
                }
            }
        }
        
        for(var i=0; i<GRID_COLUMNS; i++)
        {
            for(var j=0; j<GRID_ROWS; j++)
            {
                world[i][j].current = world[i][j].next;
                world[i][j].next = 0;
            }
        }
        
        drawGrid();
        drawCells();
        
        /* setTimeout() VS setInterval()
           - chained setTimeout() will never eat 100% CPU (if it's called at the
           end of the function), whereas setInterval() could : if the function
           needs more time than the interval to execute, the next execution will
           be pending and then executed as soon as the previous execution is
           finished
           - we don't need very precise intervals for a game of life ^^
        */
        setTimeout(gameloop, 140);
    };
    
    var fgrid = function()
    {
        settings.grid = document.getElementById("grid").checked;
    };
    
    var fshape = function()
    {
        if (document.getElementById("circles").checked)
        {
            settings.drawfunction = drawCircle;
        }
        else
        {
            settings.drawfunction = drawSquare;
        }
    };
    
    
    
    var canvas = document.getElementById("game");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    context = canvas.getContext("2d");
    
    settings.grid = true;
    settings.randomcells = 100;
    settings.drawfunction = drawSquare;
    
    document.getElementById("grid").addEventListener("click", fgrid);
    document.getElementById("squares").addEventListener("click", fshape);
    document.getElementById("circles").addEventListener("click", fshape);
    
    createWorld();
    createRandomCells();
    
    drawGrid();
    drawCells();
    
    setTimeout(gameloop, 100);
    
    /*TODO
        - add start/reset button (do...while() of the code, beginning after the context=... ?)
        - add input for count of random cells (mousedown, mouseup, input, keypress) : just at the beginning 
        - add input for interval between refresh
        - display the generation count
        - allow user to make pixels alive/dead ("activate god mode" ^^)
        - add a "news" part on my website main page
        - use a project page for the gfame of life, and link it to my personal website (same thing for klotski, instead of replicating all the stuff...)
    */
})();

