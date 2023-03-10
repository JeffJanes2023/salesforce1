let noObj = null;
let content="";
let gravity = "";
let moonlist = "";
let moonCount = 0;
let newtext ="";
let factoids="";
let output="Earth";

// generic function to get the API slect bax value changing no need for a submit button
document.getElementById("planets").onchange = function () { getData() };
//comment

async function getData() {
    newtext="";
    moonlist="";
    var cnt=0;
    facts=document.querySelector('#facts');
    selectElement = document.querySelector('#planets');
    output = selectElement.value;
    if (output == 0) {
        content="Please make a selection";
    } else {
        let queryString = 'https://api.le-systeme-solaire.net/rest/bodies/{' + output + '}';
        //console.log(queryString);
        let response = await fetch(queryString);
        let parsedRes = await response.json();
        //console.log(parsedRes);
        
        //set Earth as default
        if(!output){
            output="Earth";
        }
        //creating background swapper routine
        let holder = document.querySelector(".backimage");
        holder.setAttribute("style", "background-image: url('./image/" + output + "1.png');background-repeat: no-repeat;");

        let line = new Array();
        let floatNum=0.0;
        


        //Generating lines of data derived from API call
        line[0] = "Aphelion: " + parsedRes.aphelion + " km";
        line[1] = "Average Temp: " +  (((parseFloat(parsedRes.avgTemp) -273.15)*9/5)+32).toFixed(2)+" F";      
        line[2] = "Axial Tilt: " + parsedRes.axialTilt + " degrees";
        line[3] = "Density: " + parsedRes.density + " grams / centimeter";
        line[4] = "Equatorial Radius: " + (parsedRes.equaRadius / 1000).toFixed(4) + " million meters";
        line[5] = "Escape Velocity: " + parsedRes.escape + " meters / second";
        line[6] = "Gravity: " + parsedRes.gravity + " meters / second";       
        line[7] = "Mass: " + parsedRes.mass.massValue + "^" + parsedRes.mass.massExponent + " kg";

        if (parsedRes.moons == null) {
            line[8] = "Number of Moons: 0";
        } else {
            line[8] = "Number of Moons: " + parsedRes.moons.length +"<br>";
               
            moonCount=parsedRes.moons.length;
            for (let a = 0; a< moonCount-1;a++){
                newtext = parsedRes.moons[a].moon.replace(" ", "&nbsp;");
                if(cnt<9){
                    moonlist += newtext +", ";
                    cnt++;
                } else {
                    moonlist += newtext+"<BR>";
                    cnt=0;
                }
            } 
            line[8] +=moonlist + parsedRes.moons[moonCount-1].moon.replace(" ", "&nbsp;");
        }
        line[9] = "Perihelion: " + parsedRes.perihelion + "km";
        line[10] = "Polar Radius " + (parsedRes.polarRadius / 1000).toFixed(4) + " million meters";
        line[11] = "Orbit: " + parsedRes.sideralOrbit + " days";
        line[12] = "Rotation: " + parsedRes.sideralRotation + " hours";
        line[13] = "Volume: " + parsedRes.vol.volValue + "x 10^" + parsedRes.vol.volExponent + " billion cubic kilometers";

        content = "<div align='right'><h1 style='color:beige;'>" + output + "</h1><hr width=80%><BR>";


        //Building list from API Call
        for (let b = 0; b < line.length; b++) {
            content += line[b] + "<BR>";
        }

        /* a future calculations for interesting facts but needed more time for development of proper math
        Mass: 5.97237^24    kg                     lighter or heavier
        Volume: 1.08321x 10^12 billion cubic kilometers      if bigger  x/1083210000000 else 1083210000000/x
        */


        // program variables needed to help create factoids
        var temp =(((parseFloat(parsedRes.avgTemp) -273.15)*9/5)+32).toFixed(2)+" F";
        var equrad = (parsedRes.equaRadius / 1000).toFixed(4) + " million meters";
        var escvel = parsedRes.escape + " meters / second";
        gravity= "" + parsedRes.gravity;
        var mass = parsedRes.mass.massValue + "^" + parsedRes.mass.massExponent + " kg";
        var polrad = (parsedRes.polarRadius / 1000).toFixed(4) + " million meters";
           
        //Build interesting fact factoid section data          
        factoids = "The average temperature on "+ output + " is " + temp;
        factoids += "<BR>If you weighed 180 lbs on Earth you would weigh " + (180 * gravity /9.8).toFixed(0) +" pounds on " + output;
        factoids += "<BR>If you dug a hole at the equator straight down you would have to dig " + (parsedRes.equaRadius / 1000 - 6.3781).toFixed(2) + " million meters further to reach the center of " + output;
        factoids += "<BR>You have to reach a speed of " + escvel + " in order to break the gravitational pull of " + output;
        factoids += "";
        factoids += "<BR>If you dug a hole at the north pole straight down you would have to dig " + (parsedRes.polarRadius / 1000 - 6.3568).toFixed(2) + " million meters further to reach the center of " + output;
        factoids += "<BR>A year lasts " + (parsedRes.sideralOrbit/365.25).toFixed(2) + " Earth year(s)  on " + output +" and a day lasts " + parsedRes.sideralRotation +" hours.";

    
    }

    APIoutput.innerHTML = content; //Load API DATA
    facts.innerHTML = factoids;  //load factoids
}


