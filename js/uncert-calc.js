const numItems = ["0","1","2","3","4","5","6","7","8","9","."]
const operatorsA = ["+","-"]
const operatorsB = ["*","/","^"]
const otherItems = ["(",")","a","b"]
const termItems = [...numItems,...operatorsA,...operatorsB,...otherItems];

var uncert1 = [];
var uncert2 = [];
var terms = [];

submitEquation = function(){
    uncert1 = [];
    uncert2 = [];
    terms = [];
    uncert1 = [document.getElementById("uncert-1").value,document.getElementById("uncert-1u").value];
    uncert2 = [document.getElementById("uncert-2").value,document.getElementById("uncert-2u").value];
    terms = (document.getElementById("uncert-equation").value).split("");
    

    var test = 0
    if(test==1){
        uncert1 = ["1.1", "0.315"]
        uncert2 = ["0", "0"]
        terms = ["a", "+", "5"]
    }else if(test==2){
        uncert1 = ["12345678.90", "3512.35"]
        uncert2 = ["0", "0"]
        terms = ["a", "+", "2"]
    }else if(test==3){
        uncert1 = ["63.213", "0.35"]
        uncert2 = ["13.621", "3.4"]
        terms = ["(","a", "*", "b",")","/","2"]
    }



    terms.unshift("(")
    terms.push(")")

    clearData()
    var final = removeEnd(roundOff(solveFunction(evaluateFunction())))
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
        var title = document.createElement("h2")
        title.innerHTML=("Result")
        outputArea.appendChild(title)
        var show = document.createElement("p")
        show.innerHTML=(`${final[0][1][0]}±${final[0][1][1]}`).toString()
        outputArea.appendChild(show)
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
            var text = `Values: ${term1[0]} ^ ${term2[0]} = ${result[0]}<br>
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
            var title = `Rounding: Round everything. ${term1[0]} has ${term1[1]} sig figs, so we reduce everything.`
            var text = `Values: ${term2[0]} -> ${result[0][1][0]}<br>
            Uncertainty: ${term2[1]} -> ${result[0][1][1]}<br>`
            displayStep(title,text);
            break;
        case("slice"):
            var title = `Cutting: To finish it off, we cut off everything.`
            var text = `Values: ${term1} -> ${result[0][1][0]}<br>
            Uncertainty: ${term2} -> ${result[0][1][1]}<br>`
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
        default:
            return "Unknown Error"
    }
}
function roundOff(final){
    

    if (final[0]!="error"){
        var saveForSteps = []
        //[var, digits]
        var result = (final[0][1][0])
        if(result=="a"){
            result = [parseFloat(uncert1[0]),parseFloat(uncert1[1])]
            final[0][1][0]=[...result]
        }else if(result=="b"){
            result = [parseFloat(uncert2[0]),parseFloat(uncert2[1])]
            final[0][1][0]=[...result]
        }
        var minDecimals = 0
        var decimalsCheck = []
        if(terms.includes("a")){
            decimalsCheck.push(uncert1[0],uncert1[1])
        }
        if(terms.includes("b")){
            decimalsCheck.push(uncert2[0],uncert2[1])
        }
        
        decimalsCheck.forEach(function(round) {
            if(round.includes(".")){
                //0.00000000000000000000000001 has many sigs
                if(round[0]=="0"){
                    var numLength = round.length-2
                }else{
                    var numLength = round.length-1
                }
                

            }else{
                //2500000000000 does not
                numFront = ((parseFloat(round).toExponential()).split("e")[0])
                var numLength = numFront.length
                if(numFront.includes(".")){
                    numLength--
                }
            }
            if(minDecimals==0||minDecimals>numLength){
                minDecimals=numLength
                //trying to show steps
                saveForSteps[0] = [round,minDecimals]
            }
            
        });
        saveForSteps.push(...final[0][1]);
        (final[0][1][0]).forEach(function(round, roundIndex){
            var splitNumber = (round.toExponential()).split("e");
            //trim excess
            if(splitNumber[0].includes(".")){







                //this trims it
                if(splitNumber[0].includes(".")){
                    if(splitNumber[0].length>minDecimals){
                        splitNumber[0]=parseFloat(splitNumber[0]).toFixed(minDecimals-1)
                    }
                }else{
                    if(splitNumber[0].length>minDecimals-1){
                        splitNumber[0]=parseFloat(splitNumber[0]).toFixed(minDecimals-1)
                    }
                }
                
                
                
                if(splitNumber[0][splitNumber[0].length-1]=="."){
                    if(splitNumber[0][splitNumber[0].length-2]!="0"){
                        splitNumber[0]=splitNumber[0].slice(0,splitNumber[0].length-1)
                        //
                    }
                }
            }else{
                splitNumber[0]=splitNumber[0].slice(0,minDecimals)
            }
            if (-5<parseInt(splitNumber[1])<5){
                //exponent: splitNumber[1]
                //thingy: splitLength
                //final[0][1][roundIndex]=(parseFloat(splitNumber[0])*(10**parseInt(splitNumber[1])-1)).toString()
                var finalNumber = [];
                var splitLength = 0;


                if(splitNumber[0].includes(".")){
                    var splitResult=splitNumber[0].split(".")
                    splitLength=splitResult[1].length
                    splitResult=splitResult[0]+splitResult[1]
                    finalNumber = parseFloat(splitNumber[1])-splitLength
                }else{
                    var splitResult = splitNumber[0]
                    finalNumber = parseFloat(splitNumber[1])
                }
                if(-finalNumber>splitLength){
                    final[0][1][roundIndex] = (10**finalNumber).toString().slice(0,-finalNumber)+splitResult
                }else if(finalNumber<0){
                    final[0][1][roundIndex] = splitResult.slice(0, splitResult.length+finalNumber) + "." + splitResult.slice(splitResult.length+finalNumber);
                }else if(finalNumber>0){
                    final[0][1][roundIndex] = splitResult+(10**finalNumber).toString().substring(1,finalNumber+1)
                }else{
                    final[0][1][roundIndex] = splitResult
                }
            }else{
                final[0][1][roundIndex]=splitNumber[0]+"*10^"+((parseInt(splitNumber[1])).toString())
            }
            if (final[0][1][roundIndex][0]=="."){
                final[0][1][roundIndex] = "0"+final[0][1][roundIndex]
            }
        });
        showStep("round",...saveForSteps,final)
    }
    return final
}
function removeEnd(final){
    if (final[0]!="error"){
        var minLength = "unset";
        var saveForSteps=[...final[0][1]];
        (final[0][1]).forEach(finalTerms => {
            if(finalTerms.includes(".")){
                var splitTerms=finalTerms.split(".")
            splitLength=splitTerms[1].length
            }
            else{
                splitLength=0
            }
            while(finalTerms[finalTerms.length+splitLength-1]=="0" && finalTerms.length+splitLength>1){
                splitLength--
            }

            if(minLength=="unset"||minLength>splitLength){
                minLength=splitLength
            }
        });
        (final[0][1]).forEach(function(finalTerms, finalIndex){
            if(finalTerms.includes(".")){
                var splitTerms=finalTerms.split(".")
                splitLength=splitTerms[1].length
            
                if(minLength>0&&splitLength>0){
                    while(splitLength>minLength){
                        finalTerms = finalTerms.slice(0,splitTerms[0].length+splitLength)
                        splitLength--
                    }
                }else if(minLength==0){
                    finalTerms = splitTerms[0]
                }else if(minLength<0){
                    finalTerms = splitTerms[0]
                    splitLength=0;
                    //splitLength+splitTerms[1].length
                    while(splitLength>minLength){
                        finalTerms[finalTerms.length+splitLength]
                        finalTerms = finalTerms.slice(0, finalTerms.length+splitLength-1) + "0" + finalTerms.slice(finalTerms.length+splitLength);
                        /////gasdgadsgadgasdg nononoo
                        splitLength--
                    }
                }
            }else{
                if(minLength<0){
                    splitLength=0;
                    //splitLength+splitTerms[1].length
                    while(splitLength>minLength){
                        finalTerms[finalTerms.length+splitLength]
                        finalTerms = finalTerms.slice(0, finalTerms.length+splitLength-1) + "0" + finalTerms.slice(finalTerms.length+splitLength);
                        /////gasdgadsgadgasdg nononoo
                        splitLength--
                    }
                }
            }
            final[0][1][finalIndex] = finalTerms
        });
        showStep("slice",...saveForSteps,final)
    }
    return final
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
    }
    return reFunc;
}
function solveChunk(chunk){//solves things by bracket chunks
    //bedmas level (^),(/*),(+-), then index 
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
    return chunk[0][0]

}
function solveEquation(short){//single formula
    if (short[0]=="a"){
        short[0]=[parseFloat(uncert1[0]),parseFloat(uncert1[1])]
    }else if (short[0]=="b"){
        short[0]=[parseFloat(uncert2[0]),parseFloat(uncert2[1])]
    }
    if (short[2]=="a"){
        short[2]=[parseFloat(uncert1[0]),parseFloat(uncert1[1])]
    }else if (short[2]=="b"){
        short[2]=[parseFloat(uncert2[0]),parseFloat(uncert2[1])]
    }
    var uncertPos=[0,0]

    if (Array.isArray(short[0])){
        uncertPos[0]=1
        if (short[0].length==1){
            short[0]=short[0][0]
        }
    }
    if (Array.isArray(short[2])){
        uncertPos[1]=1
        if (short[2].length==1){
            short[2]=short[2][0]
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
                showStep("^1",short[0],short[2],smallResult)
                return short[0]^short[2]
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
                correctedFunction.push([])
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
        return (correctedFunction);
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
    }else if((isVar(currentTerm)&&(nextTerm=="a"||nextTerm=="b")||(currentTerm=="a"||currentTerm=="b")&&isVar(nextTerm))||(isVar(currentTerm)&&nextTerm=="(")||(currentTerm==")"&&isVar(nextTerm))){
        terms = [...terms.slice(0, termN+1),"*",...terms.slice(termN+1)];
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
