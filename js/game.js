(function()
{
    var GRID_SQUARE_SIZE = 10;
    
    
    
    var context;
    var world = [];
    var settings =
    {
        nbrows: undefined,
        nbcolumns: undefined,
        grid: undefined,
        randomcells: undefined,
        drawfunction: undefined,
        refreshinterval: undefined
    };
    var gameloopID;
    var canvaswidth;
    var canvasheight;
    var generation = 0;
    
    
    
    /* -------------------------- Drawing functions ------------------------- */
    
    var drawGrid = function()
    {
        context.fillStyle = "white";
        context.fillRect(0, 0, canvaswidth, canvasheight);
        
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
        for(var i=0.5; i<canvaswidth; i+=GRID_SQUARE_SIZE)
        {
            context.moveTo(i, 0);
            context.lineTo(i, canvasheight);
        }
        
        for(var j=0.5; j<canvasheight; j+=GRID_SQUARE_SIZE)
        {
            context.moveTo(0, j);
            context.lineTo(canvaswidth, j);
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
        for(var i=0; i<settings.nbcolumns; i++)
        {
            for(var j=0; j<settings.nbrows; j++)
            {
                if (world[i][j].current == 1)
                {
                    settings.drawfunction(i, j);
                }
            }
        }
    };
    
    /* ------------------------ Game logic functions ------------------------ */
    
    var initWorld = function()
    {
        for(var i=0; i<settings.nbcolumns; i++)
        {
            var row = [];
            
            for(var j = 0; j<settings.nbrows; j++)
            {
                row[j] = {current: 0, next: 0};
            }
            
            world[i] = row;
        }
    };
    
    var createRandomCells = function()
    {
        for(var i=0; i<settings.randomcells; i++)
        {
            do
            {
                var column = Math.floor(Math.random() * settings.nbcolumns);
                var row = Math.floor(Math.random() * settings.nbrows);
            }
            while(world[column][row].current == 1);
            
            world[column][row].current = 1;
        }
    };
    
    var isCurrentStepCellAlive = function(i, j)
    {
        if (i < 0 || i >= settings.nbcolumns
         || j < 0 || j >= settings.nbrows
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
    
    var gameloop = function()
    {
        /* TODO 2 double-for here, could be improved with a 3-properties world[][] ?
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
        
        for(var i=0; i<settings.nbcolumns; i++)
        {
            for(var j=0; j<settings.nbrows; j++)
            {
                if (isNextStepCellAlive(i,j))
                {
                    world[i][j].next = 1;
                }
            }
        }
        
        for(var i=0; i<settings.nbcolumns; i++)
        {
            for(var j=0; j<settings.nbrows; j++)
            {
                world[i][j].current = world[i][j].next;
                world[i][j].next = 0;
            }
        }
        
        drawGrid();
        drawCells();
        generation++;
        document.getElementById("generation").innerHTML = "generation : " + generation;
    };
    
    /* --------------------- Events callback functions ---------------------- */
    
    var buttonDisable = function(button, disable)
    {
        if (disable)
        {
            button.disabled = true;
            button.style.background = "gray";
            button.style.color = "silver";
        }
        else
        {
            button.disabled = false;
            button.style.background = "silver";
            button.style.color = "white";
        }
    };
    
    var fgrid = function()
    {
        settings.grid = document.getElementById("grid").checked;
        
        if (generation == 0)    /* game is not started : refresh manually */
        {
            drawGrid();
            drawCells();
        }
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
        
        if (generation == 0)    /* game is not started : refresh manually */
        {
            drawGrid();
            drawCells();
        }
    };
    
    var fcreate = function()
    {
        if (document.getElementById("startreset").disabled)
        {
            buttonDisable(document.getElementById("startreset"), false);
        }
        
        initWorld();
        createRandomCells();
        drawGrid();
        drawCells();
    };
    
    var fstart = function()
    {
        var button = document.getElementById("startreset");
        
        document.getElementById("cells").disabled = true;
        document.getElementById("interval").disabled = true;
        document.getElementById("width").disabled = true;
        document.getElementById("height").disabled = true;
        buttonDisable(document.getElementById("create"), true);
        
        button.removeEventListener("click", fstart);
        button.addEventListener("click", freset);
        button.innerHTML = "RESET";
        
        /* setTimeout() VS setInterval()
           - chained setTimeout() will never eat 100% CPU (if it's called at the
           end of the function), whereas setInterval() could : if the function
           needs more time than the interval to execute, the next execution will
           be pending and then executed as soon as the previous execution is
           finished
           - we don't really need very precise intervals for a game of life (as
           with setTimeout(), the real interval = interval + function execution)
           
           => but we allow the user to specify the interval, so it's
              funnier and more precise with a setInterval() ^^
        */
        gameloopID = setInterval(gameloop, settings.refreshinterval);
    };
    
    var freset = function()
    {
        var button = document.getElementById("startreset");
        
        clearInterval(gameloopID);
        
        initWorld();
        drawGrid();
        generation = 0;
        document.getElementById("generation").innerHTML = "generation : 0";
        
        buttonDisable(button, true);
        button.removeEventListener("click", freset);
        button.addEventListener("click", fstart);
        button.innerHTML = "START";
        
        document.getElementById("cells").disabled = false;
        document.getElementById("interval").disabled = false;
        document.getElementById("width").disabled = false;
        document.getElementById("height").disabled = false;
        buttonDisable(document.getElementById("create"), false);
    };
    
    var fcells = function()
    {
        var newval = document.getElementById("cells").value;
        
        if (settings.nbcolumns * settings.nbrows < newval)
        {
            settings.randomcells = settings.nbcolumns * settings.nbrows;
            document.getElementById("cells").value = settings.randomcells;
        }
        else
        {
            settings.randomcells = newval;
        }
    };
    
    var finterval = function()
    {
        settings.refreshinterval = document.getElementById("interval").value;
    };
    
    var fwidth = function()
    {
        settings.nbcolumns = document.getElementById("width").value
        canvaswidth = GRID_SQUARE_SIZE * settings.nbcolumns + 1;
        document.getElementById("canvas").width = canvaswidth;
        
        if (settings.nbcolumns * settings.nbrows < settings.randomcells)
        {
            settings.randomcells = settings.nbcolumns * settings.nbrows;
            document.getElementById("cells").value = settings.randomcells;
        }
        
        initWorld();
        drawGrid();
        drawCells();
    };
    
    var fheight = function()
    {
        settings.nbrows = document.getElementById("height").value
        canvasheight = GRID_SQUARE_SIZE * settings.nbrows + 1;
        document.getElementById("canvas").height = canvasheight;
        
        if (settings.nbcolumns * settings.nbrows < settings.randomcells)
        {
            settings.randomcells = settings.nbcolumns * settings.nbrows;
            document.getElementById("cells").value = settings.randomcells;
        }
        
        initWorld();
        drawGrid();
        drawCells();
    };
    
    
    
    settings.grid = true;
    settings.randomcells = 300;
    settings.drawfunction = drawSquare;
    settings.refreshinterval = 120;
    settings.nbcolumns = 70;
    settings.nbrows = 50;
    
    document.getElementById("cells").value = 300;
    document.getElementById("interval").value = 120;
    document.getElementById("width").value = 70;
    document.getElementById("height").value = 50;
    
    canvaswidth = GRID_SQUARE_SIZE * settings.nbcolumns + 1;
    canvasheight = GRID_SQUARE_SIZE * settings.nbrows + 1;
    
    var canvas = document.getElementById("canvas");
    canvas.width = canvaswidth;
    canvas.height = canvasheight;
    
    context = canvas.getContext("2d");
    
    document.getElementById("width").addEventListener("input", fwidth);
    document.getElementById("height").addEventListener("input", fheight);
    document.getElementById("cells").addEventListener("input", fcells);
    document.getElementById("interval").addEventListener("input", finterval);
    document.getElementById("grid").addEventListener("click", fgrid);
    document.getElementById("squares").addEventListener("click", fshape);
    document.getElementById("circles").addEventListener("click", fshape);
    document.getElementById("create").addEventListener("click", fcreate);
    document.getElementById("startreset").addEventListener("click", fstart);
    
    buttonDisable(document.getElementById("startreset"), true);
    
    initWorld();
    drawGrid();
    
    /* TODO
        => allow the user to make pixels alive/dead
            + draw your world !
            + activate god mode ^^
    */
})();

