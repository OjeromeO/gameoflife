(function()
{
    var GRID_SQUARE_SIZE = 10;
    var GRID_COLUMNS = 70;
    var GRID_ROWS = 50;
    var RANDOM_CELLS = 0;
    
    
    
    
    
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
                //row[j] = 0;
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
            //while(world[column][row] == 1);
            while(world[column][row].current == 1);
            
            //world[column][row] = 1;
            world[column][row] = {current: 1, next: 0};
        }
    };
    
    var isCurrentStepCellAlive = function(i, j)
    {
        if (i < 0 || i >= GRID_COLUMNS
         || j < 0 || j >= GRID_ROWS
         //|| world[i][j] == 0)
         || world[i][j].current == 0)
        {
            return false;
        }
        
        //if (world[i][j] == 1)
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
                //if (world[i][j] == 1)
                if (world[i][j].current == 1)
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
    
    // glider
    world[9][8].current = 1;
    world[10][9].current = 1;
    world[8][10].current = 1;
    world[9][10].current = 1;
    world[10][10].current = 1;
    
    // frog
    world[20][10].current = 1
    world[21][10].current = 1
    world[22][10].current = 1
    world[19][11].current = 1
    world[20][11].current = 1
    world[21][11].current = 1
    
    // gun
    world[30][10].current = 1;
    world[31][10].current = 1;
    world[30][11].current = 1;
    world[31][11].current = 1;
    world[43][8].current = 1;
    world[42][8].current = 1;
    world[41][9].current = 1;
    world[40][10].current = 1;
    world[40][11].current = 1;
    world[40][12].current = 1;
    world[41][13].current = 1;
    world[42][14].current = 1;
    world[43][14].current = 1;
    world[44][11].current = 1;
    world[45][9].current = 1;
    world[45][13].current = 1;
    world[46][10].current = 1;
    world[46][11].current = 1;
    world[46][12].current = 1;
    world[47][11].current = 1;
    world[50][8].current = 1;
    world[50][9].current = 1;
    world[50][10].current = 1;
    world[51][8].current = 1;
    world[51][9].current = 1;
    world[51][10].current = 1;
    world[52][7].current = 1;
    world[52][11].current = 1;
    world[54][6].current = 1;
    world[54][7].current = 1;
    world[54][11].current = 1;
    world[54][12].current = 1;
    world[64][8].current = 1;
    world[65][8].current = 1;
    world[64][9].current = 1;
    world[65][9].current = 1;
    
    createRandomCells();
    
    drawGrid();
    drawCells();
    
    setInterval(function()
                {
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
                },
                100);
    
    
    
    
    
    /*TODO
        - use an IEF for the klotski game (on github + website + backups)
        - add a "news" part on my website main page
        - don't stop the cells at the canvas boundaries, but make them go to the opposite side ?
        - later, with a button/form, allow the user to draw square or circles, and depending on his choice, use a "var drawCell" that will be set either on drawSquare or drawCircle
    */
})();

