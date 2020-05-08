const numItems = ["0","1","2","3","4","5","6","7","8","9","."]
const operatorsA = ["+","-"]
const operatorsB = ["*","/","^"]
const otherItems = ["(",")","a","b"]
const termItems = [...numItems,...operatorsA,...operatorsB,...otherItems];
const termsAndService = [
    "not whine when the calculator is wrong but rather tell me what's wrong",
    "not use this tool to create weapons of mass destruction",
    "buy me jello :3",
    "give me a crisp high-five next time on the hallway",
    "share this with your friends!"
]


var uncert1 = [];
var uncert2 = [];
var terms = [];

submitEquation = function(){
    uncert1 = [];
    uncert2 = [];
    terms = [];
    skip = 0;
    uncert1 = [document.getElementById("uncert-1").value,document.getElementById("uncert-1u").value];
    uncert2 = [document.getElementById("uncert-2").value,document.getElementById("uncert-2u").value];
    terms = (document.getElementById("uncert-equation").value).toLowerCase().split("");
    

    var test = 0
    if(test==1){
        uncert1 = ["7412.53125", "12"]
        uncert2 = ["0", "0"]
        terms = ["a"]
    }else if(test==2){
        uncert1 = ["12345678.90", "3512.35"]
        uncert2 = ["0", "0"]
        terms = ["a", "+", "2"]
    }else if(test==3){
        uncert1 = ["1.0", "0.1"]
        uncert2 = ["15.0", "0.1"]
        terms = ["(","a", "+", "b",")"]
    }else if(test==4){
        uncert1 = ["0.29", "0.10"]
        uncert2 = ["", ""]
        terms = ["(","a",")"]
    }else if(test==5){
        uncert1 = ["74123.6341", "315.126317"]
        uncert2 = ["1634.7432", "2.1"]
        terms = ["(","a","(","a","+","b","+","a",")","/","b",")","7","^","2"]
    }//Values: 333006535.3311124 -> 330000000
    //Uncertainty: 3248468.4798105145 -> 3200000



    terms.unshift("(")
    terms.push(")")

    clearData()
    var final = chopValue(rounding(solveFunction(evaluateFunction())))
    showResult(final)
}

function clearData(){
    var outputArea = document.getElementById("outputArea")
    if (outputArea!=null){
        outputArea.parentNode.removeChild(outputArea);
    }
    var outputArea = document.createElement("div")
    outputArea = document.createElement("div")
    
    outputArea.id="outputArea"
    
    document.getElementById("output").appendChild(outputArea)
    var nextLine = document.createElement("hr")
    nextLine.setAttribute("noshade",true)
    outputArea.appendChild(nextLine)


}

function showResult(final){

    if(final[0]=="error"){
        var show = document.createElement("p")
        show.innerHTML=("ERROR: "+errorInfo(final)).toString()
        outputArea.appendChild(show)

    }else{
        if(skip==0){
            var title = document.createElement("h2")
            title.innerHTML=("Result")
            outputArea.appendChild(title)
            var show = document.createElement("p")
            show.innerHTML=(`${final[0]}±${final[1]}`).toString()
            outputArea.appendChild(show)
            var title = document.createElement("h2")
            title.innerHTML=("WARNING:")
            outputArea.appendChild(title)
            var show = document.createElement("p")
            show.innerHTML=(`by looking at the result, you agree to ${termsAndService[Math.floor((termsAndService.length)*(Math.random()))]}`)
            outputArea.appendChild(show)
        }
    }
}

function showStep(operation,term1,term2, result){
    //operation +*/whatever term1 = [thing,uncert]
    switch(operation){
        case("+"):
            var title = "Addition: Add both the values and uncertainties."
            var text = `Values: ${term1[0]} + ${term2[0]} = ${result[0]}<br>
            Uncertainty: ${term1[1]} + ${term2[1]} = ${result[1]}<br>`
            displayStep(title,text);
            break;
        case("-"):
            var title = "Subtraction: Subtract the values, but add the uncertainties."
            var text = `Values: ${term1[0]} - ${term2[0]} = ${result[0]}<br>
            Uncertainty: ${term1[1]} + ${term2[1]} = ${result[1]}<br>`
            displayStep(title,text);
            break;
        case("*"):
            var title = "Multiplication: Multiply the values, add percent uncertainties. Convert back to absolute unceratinty."
            var text = `Values: ${term1[0]} * ${term2[0]} = ${result[0]}<br>
            Uncertainty: ${term1[0]} * ${term2[0]} * (${term1[1]} / ${term1[0]} + ${term2[1]} / ${term2[0]}) = ${result[1]}<br>`
            displayStep(title,text);
            break;
        case("/"):
            var title = "Division: Divide the values, add percent uncertainties. Convert back to absolute unceratinty."
            var text = `Values: ${term1[0]} / ${term2[0]} = ${result[0]}<br>
            Uncertainty: ${term1[0]} / ${term2[0]} * (${term1[1]} / ${term1[0]} + ${term2[1]} / ${term2[0]}) = ${result[1]}<br>`
            displayStep(title,text);
            break;
        case("^1"):
            var title = "Exponentation: Well I hope you can do this part"
            var text = `Values: ${term1} ^ ${term2} = ${result}<br>
            Uncertainty: Why'd you even write this? Can't you just simplify this yourself skrub<br>`
            displayStep(title,text);
            break;
        case("^2"):
            var title = `Exponentation: Multiply percent uncertainty ${term2[0]} times.`
            var text = `Values: ${term1[0]} ^ ${term2[0]} = ${result[0]}<br>
            Uncertainty: ${term1[0]} ^ ${term2[0]} * (${term2[0]} * (${term1[0]} / ${term1[1]})) = ${result[1]}<br>`
            displayStep(title,text);
            break;
        case("^3"):
                var title = "Exponentation: Only God can help you with this one (or your physics teacher but they might just be the same person idk)"
                var text = `Values: ${term1[0]} ^ ${term2[0]} = ${result[0]}<br>
                Uncertainty: ask your mother = ${result[1]}<br>`
                displayStep(title,text);
                break;
        case("round"):
            if(term1[1].length==!1&&term1[1][0]=="1"){
                var title = `Rounding: Round the uncertainty to two sig figs because there is a "1" at the front.`
            }else{
                var title = `Rounding: Round the uncertainty to one sig fig.`
            }            
            try{
                var text = `Uncertainty: ${term1[0]} -> ${term1[1]}`
            }catch{
                var title = "Are you kidding me?"
                var text = "you didn't even use the calculator properly. why don't you type the same thing on google?<br>"
                skip=1
            }
            displayStep(title,text);
            break;
        case("slice"):
            var title = `Cutting: To finish off, we cut the value to have the same place value as the uncertainty`
            var text = `Value: ${term1[0]} -> ${term1[1]}<br>`
            displayStep(title,text);
            break;
    }
    function displayStep(title,subtext){
        var heading = document.createElement("h3")
        heading.innerHTML=(title).toString()
        outputArea.appendChild(heading)
        var desc = document.createElement("p")
        desc.innerHTML=(subtext).toString()
        outputArea.appendChild(desc)
    }
}

function errorInfo(error){
    switch(error[1]){
        case "empty":
            return "The Equation is empty."
        case "illegalItem":
            return `Unexpected char ${terms[error[2]]} on position ${error[2]}`
        case "endIllegal":
            return `Equation cannot end with stray operation ${terms[terms.length-2]}`
        case "illegalFormat":
            return `Operation ${terms[error[2]]} on line ${error[2]} cannot be directly followed by ${terms[error[2]+1]}`
        case "uncert1-incomplete":
            return "All fields for the first variable must be filled out"
        case "uncert2-incomplete":
            return "All fields for the second variable must be filled out"
        case "unbalancedBrackets":
            if(error[2]>0){
                return `Unbalanced Brackets. ${error[2]} extra "("s`
            }else{
                return `Unbalanced Brackets. ${-error[2]} extra ")"s`
            }
            
        default:
            return "Unknown Error"
    }
}

function rounding(solvedEquation){
    if(solvedEquation[0]!="error"){
        return [solvedEquation[0].toString(),reduceFigures(solvedEquation[1])]
    }else{
        return solvedEquation
    }
    function reduceFigures(uncertainty){
        //reduce to 1 sig fig, 2 if if starts with 1.
        uncert = (parseFloat(uncertainty).toExponential()).split("e")
        
        if(uncert[0][0]=="1"&&uncert[0].length!=1){
            //you can have 2 sig figs if the leading char is 1
            uncert = [(parseFloat(uncert[0])*10).toFixed(0), (parseFloat(uncert[1])-1).toString()]
        }else {
            uncert[0] = parseFloat(uncert[0]).toFixed(0)
        }
        if(parseFloat(uncert[1])>=0){
            //do values when 10^+
            uncert = uncert[0]+(10**uncert[1]).toString().slice(1)
        }else if(parseFloat(uncert[1])<0){
            if(uncert[1]=="-1"&&uncert[0].length==2){
                uncert = uncert[0][0]+"."+uncert[0][1]
            }else{
                //do values when 10^-
                if(uncert[0].length==2){
                    uncert = (10**uncert[1]).toString().slice(0,2-uncert[1]-uncert[1].length)+uncert[0]
                }else{
                    uncert = (10**uncert[1]).toString().slice(0,3-uncert[1]-uncert[1].length)+uncert[0]
                }
                
            }
        }
        showStep("round",[uncertainty,uncert])
        return uncert
        
    }
}

function chopValue(cutFunction){
    if(cutFunction[0]!="error"){
        return [cutValue(cutFunction),cutFunction[1]]
    }else{
        return cutFunction
    }
    function cutValue(getSliced){
        function findCut(uncert){
            //find where to slice
            var placeValues = parseFloat(uncert).toExponential().split("e")
            var placeToCut = parseFloat(placeValues[1]);
            if(placeValues[0].toString().length==3){
            placeToCut--
            }
            return placeToCut
        }
        sliceTo = findCut(getSliced[1])




        varLength = getSliced[0].toString().length  
        firstDecimal = getSliced[0].indexOf(".")

        cutPosition = parseFloat(parseFloat(getSliced[0]).toExponential().split("e")[1])-sliceTo+1
        if(getSliced[1][0]=="1"&&getSliced[1].length!=1){
            cutPosition--
        }
        while(cutPosition>getSliced[0].length-1){
            if(getSliced[0].includes(".")){
                getSliced[0] = getSliced[0]+"0"
            }else{
                getSliced[0] = getSliced[0]+".0"
            }
        }


        if(sliceTo>=0){
            sliceTo++
        }
        cutFinal = getSliced[0]
        dotIndex = cutFinal.indexOf(".")
        if(dotIndex==-1){
            dotIndex=cutFinal.length
        }

        //dotIndex-sliceTo-1 number to round
        //dotIndex-sliceTo number to check
        if(cutFinal[dotIndex-sliceTo+1]=="."){
            if(parseInt(cutFinal[dotIndex-sliceTo+2])>=5){
                front = cutFinal.slice(0,dotIndex-sliceTo)+(parseInt(cutFinal[dotIndex-sliceTo])+1).toString()
            }else{
                front = cutFinal.slice(0,dotIndex-sliceTo+1)
            }
            cutFinal = front
            

        }else{
            if(parseInt(cutFinal[dotIndex-sliceTo+1])>=5){
                front = cutFinal.slice(0,dotIndex-sliceTo)+(parseInt(cutFinal[dotIndex-sliceTo])+1).toString()
            }else{
                front = cutFinal.slice(0,dotIndex-sliceTo+1)
            }
            ending = cutFinal.slice(dotIndex-sliceTo+1)
            if(ending!=""&&front.indexOf(".")==-1){
                ending = "0"+ending.slice(1)
                cutFinal = front + ending
            }else{
                cutFinal = front
            }
            
        }







        showStep("slice",[getSliced[0],cutFinal])
        return cutFinal


    }
}






function findPrevIndex(reFunc,funcLevel,funcIndex){//looks for the index of the compressed bracket
    for(findIndex=1;findIndex<reFunc[funcLevel-1].length;findIndex++){
        for(findArray=0;findArray<reFunc[funcLevel-1][findIndex].length;findArray++){
            if((reFunc[funcLevel-1][findIndex][findArray]).toString()==((["bracket",funcIndex]).toString())){
                return [findIndex,findArray]
            }
        }
    }
    return "error"
}
function solveFunction(reFunc){//finds each bracket chunk
    if (reFunc[0]!="error"){
        for(funcLevel=reFunc.length-1; funcLevel > 0; funcLevel--){
            for(funcIndex=1;funcIndex<(reFunc[funcLevel].length);funcIndex++){
                found=findPrevIndex(reFunc,funcLevel,funcIndex)
                condensedChunk=solveChunk(reFunc[funcLevel][funcIndex])
                if (Array.isArray(condensedChunk)){
                    reFunc[funcLevel-1][found[0]][found[1]] = condensedChunk
                    //error return
                }else{
                    reFunc[funcLevel-1][found[0]][found[1]] = condensedChunk.toString()
                }

                
                reFunc[funcLevel][funcIndex] = []
            }
            reFunc.pop()
        }
        reFunc = reFunc[0][1][0];
        while(Array.isArray(reFunc[0])){
            reFunc = reFunc[0]
        }
    }
    return reFunc;
}
function solveChunk(chunk){//solves things by bracket chunks
    //bedmas level (^),(/*),(+-), then index 
    
    chunk.forEach(function (formulaParts, formulaIndex){
        if (formulaParts=="a"){
            chunk[formulaIndex]=[parseFloat(uncert1[0]),parseFloat(uncert1[1])]
        }else if (formulaParts=="b"){
            chunk[formulaIndex]=[parseFloat(uncert2[0]),parseFloat(uncert2[1])]
        }
    });
    if(Array.isArray(chunk)){
        while(chunk.length>1){
            var bedmas=[0,0];
            for(funcBIndex=1;funcBIndex<chunk.length-1;funcBIndex++){
                if(bedmas[0]==0 && (chunk[funcBIndex]=="+"||chunk[funcBIndex]=="-")){
                    bedmas=[1,funcBIndex]
                }else if(bedmas[0]<2 && (chunk[funcBIndex]=="*"||chunk[funcBIndex]=="/")){
                    bedmas=[2,funcBIndex]
                }else if(bedmas[0]<3 && (chunk[funcBIndex]=="^")){
                    bedmas=[3,funcBIndex]
                }
            }
            
    //error return
            chunk[bedmas[1]-1] = [solveEquation([chunk[bedmas[1]-1],chunk[bedmas[1]],chunk[bedmas[1]+1]])];
            chunk.splice(bedmas[1],2);
        }
    }
    return chunk[0]

}
function solveEquation(short){//single formula
    var uncertPos=[0,0]

    if (Array.isArray(short[0])){
        uncertPos[0]=1
        while(short[0].length==1&&Array.isArray(short[0])){
            short[0]=short[0][0]
        }
        if (short[0].length==1||short[0][1]==0){
            short[0]=(short[0][0][0]).toString()
            uncertPos[0]=0
        }
    }
    if (Array.isArray(short[2])){
        uncertPos[1]=1
        while(short[2].length==1&&Array.isArray(short[2])){
            short[2]=short[2][0]
        }
        if (short[2][1]==0){
            short[2]=(short[2][0][0]).toString()
            uncertPos[1]=0
        }
    }

    

    if (short[1]=="+"){
        //adds uncert to numbers without
        if(!Array.isArray(short[0])){
            short[0] = [short[0],0]
        }
        if(!Array.isArray(short[2])){
            short[2] = [short[2],0]
        }

        //two uncertainties
        var smallResult = [parseFloat(short[0][0])+parseFloat(short[2][0]),parseFloat(short[0][1])+parseFloat(short[2][1])]
        showStep("+",short[0],short[2],smallResult)
        return smallResult

        
    }else if (short[1]=="-"){
        //adds uncert to numbers without
        if(!Array.isArray(short[0])){
            short[0] = [short[0],0]
        }
        if(!Array.isArray(short[2])){
            short[2] = [short[2],0]
        }

        //two uncertainties
        var smallResult = [parseFloat(short[0][0])-parseFloat(short[2][0]),parseFloat(short[0][1])+parseFloat(short[2][1])]
        showStep("-",short[0],short[2],smallResult)
        return smallResult
    }else if (short[1]=="*"){
        //adds uncert to numbers without
        if(!Array.isArray(short[0])){
            short[0] = [short[0],0]
        }
        if(!Array.isArray(short[2])){
            short[2] = [short[2],0]
        }
        //two uncertaintities (add %)
        var result = short[0][0]*short[2][0];
        var smallResult = [result,result*(short[0][1]/short[0][0]+short[2][1]/short[2][0])]
        showStep("*",short[0],short[2],smallResult)
        return smallResult
    }else if (short[1]=="/"){
        //adds uncert to numbers without
        if(!Array.isArray(short[0])){
            short[0] = [short[0],0]
        }
        if(!Array.isArray(short[2])){
            short[2] = [short[2],0]
        }//come back to this
        //two uncertaintities (add %)
        var result = short[0][0]/short[2][0];
        var smallResult = [result,result*(short[0][1]/short[0][0]+short[2][1]/short[2][0])]
        showStep("/",short[0],short[2],smallResult)
        return smallResult
    }else if (short[1]=="^"){
        if (uncertPos[1]==0){
            if(uncertPos[0]==0){
                var smallResult = short[0]**short[2]
                showStep("^1",short[0],short[2],smallResult)
                return smallResult
            }else{
                //uncert ^ number (add %)
                var result = short[0][0]**short[2];
                var smallResult = [result,result*(short[2]*(short[0][1]/short[0][0]))]
                showStep("^2",short[0],short[2], smallResult)
                return smallResult
            }
        }else{
        
            if(!Array.isArray(short[0])){
                short[0] = [short[0],0]
            }
            if(!Array.isArray(short[2])){
                short[2] = [short[2],0]
            }
            var a=short[0][0]
            var b=short[2][0]
            var result = a**b;
            var ua = (short[0][1]/a)
            var ub = (short[2][1]/b)
            var smallResult = [result,(((b*(a**(b-1))*ua)**2)+((a**b)*Math.log(a)*ub)**2)**0.5]
            showStep("^3",short[0],short[2],smallResult)
            return smallResult
        }
    }
    return short[0]
}



function evaluateFunction(){//turns string into array stuffs
    error = errorCheck()
    if (error!="legal"){
        return error;
    }else{
        var correctedFunction = [[1,[]]];
        var bracketN=0;
        for (termN=0; termN<terms.length; termN++){
            if(terms[termN]=="("){
                bracketN++;
                if(correctedFunction.length==bracketN){
                    correctedFunction.push([])
                }
                if(isNaN(correctedFunction[bracketN][0])){
                    correctedFunction[bracketN][0]=1;
                }else{
                    correctedFunction[bracketN][0]++;
                }
                
                correctedFunction[bracketN].push([])
            }else if(terms[termN]==")"){
                /*correctedFunction[bracketN-1].push([...correctedFunction[bracketN]])
                correctedFunction.splice(bracketN,1)*/
                bracketN--;
                correctedFunction[bracketN][correctedFunction[bracketN][0]].push(["bracket",correctedFunction[bracketN+1][0]])
            }else{
                correctedFunction[bracketN][correctedFunction[bracketN][0]].push(terms[termN]);
            }
        }
        if(bracketN==0){
            return (correctedFunction);
        }else{
            return ["error","unbalancedBrackets",bracketN]
        }
    }

}
function errorCheck(){//checks what errors there are
    if(terms.length==2){
        return ["error","empty"];
    }
    if(terms.includes("a")){
        if(isNaN(uncert1[0])||isNaN(uncert1[1])||uncert1[0]==""||uncert1[1]==""){
            return ["error","uncert1-incomplete"]
        }
    }
    if(terms.includes("b")){
        if(isNaN(uncert2[0])||isNaN(uncert2[1])||uncert2[0]==""||uncert2[1]==""){
            return ["error","uncert2-incomplete"]
        }
    }    
    var termN=0;
    while (termN<terms.length-1){
        termN++
        var error = (termValidity(termN))
        if (error=="reduceOne"){
            termN--
        }else if (error!="legal"){
            return ["error",error,termN];
        }
    }
    return "legal";
}


function isVar(i){
    if (!isNaN(i) || i=="a"||i=="b"){
        return true
    }
    return false
}

function termValidity(termN){
    var currentTerm = terms[termN]
    var nextTerm = terms[termN+1]
    if (!(termItems.includes(currentTerm))){
        return "illegalItem";
    }
    if(termN<terms.length-1){
        if((operatorsA.includes(currentTerm) && operatorsA.includes(nextTerm))||(operatorsB.includes(currentTerm) && operatorsB.includes(nextTerm))||(operatorsB.includes(currentTerm) && operatorsB.includes(nextTerm))){
            return "illegalFormat";
        }
    }
    if (termN==0 && operatorsB.includes(currentTerm)){
        return "startIllegal";
    }else if(nextTerm==" "){
        terms.splice(termN+1,1);
        return "reduceOne"
    }else if((isVar(currentTerm)&&(nextTerm=="a"||nextTerm=="b")||(currentTerm=="a"||currentTerm=="b")&&isVar(nextTerm))||(isVar(currentTerm)&&nextTerm=="(")||(currentTerm==")"&&isVar(nextTerm))){
        terms = [...terms.slice(0, termN+1),"*",...terms.slice(termN+1)];
        return "reduceOne"
    }
    else if(!isNaN(terms[termN-1]) && numItems.includes(currentTerm)){
        terms[termN-1] = terms[termN-1]+currentTerm
        terms.splice(termN,1)
        return "reduceOne"
    }else if(terms[termN-1]=="." && numItems.includes(currentTerm)){
        terms[termN-1] = "0"+terms[termN-1]+currentTerm
        terms.splice(termN,1)
        return "reduceOne"
    }else if(termN==1 && operatorsA.includes(terms[termN-1]) && isVar(currentTerm)){
        terms[termN-1] = terms[termN-1]+currentTerm
        terms.splice(termN,1);
        return "reduceOne"
        //"same thing as under but when its at the front"
    }else if(!isVar(terms[termN-2]) && operatorsA.includes(terms[termN-1]) && isVar(currentTerm)){
        //"-", "a" -> "-a"
        if(terms[termN-1]=="-"){
            terms[termN-1] = terms[termN-1]+currentTerm
            terms.splice(termN,1);
        }else{
            terms[termN-1] = currentTerm
            terms.splice(termN,1);
        }
        return "reduceOne"
    }
    if (termN==terms.length-2 && (operatorsA.includes(currentTerm)||operatorsB.includes(currentTerm))){
        return "endIllegal";
    }
    return "legal";
}
