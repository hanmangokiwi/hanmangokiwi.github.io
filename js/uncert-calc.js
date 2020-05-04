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
    uncert1 = [parseFloat(document.getElementById("uncert-1").value),parseFloat(document.getElementById("uncert-1u").value)];
    uncert2 = [parseFloat(document.getElementById("uncert-2").value),parseFloat(document.getElementById("uncert-2u").value)];
    terms = (document.getElementById("uncert-equation").value).split("");
    terms.unshift("(")
    terms.push(")")
    //console.log(uncert2)

    var final = (solveFunction(evaluateFunction()))
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
                reFunc[funcLevel-1][found[0]][found[1]] = (solveChunk(reFunc[funcLevel][funcIndex])).toString();
                reFunc[funcLevel][funcIndex] = []
            }
            reFunc.pop()
        }
    }
    return reFunc;
}
function solveChunk(chunk){//solves things by bracket chunks
    //bedmas level (^),(/*),(+-), then index 
    var bedmas=[0,0];
    while(chunk.length>1){
        for(funcBIndex=1;funcBIndex<chunk.length-1;funcBIndex++){
            if(bedmas[0]==0 && (chunk[funcBIndex]=="+"||chunk[funcBIndex]=="-")){
                bedmas=[1,funcBIndex]
            }else if(bedmas[0]<2 && (chunk[funcBIndex]=="*"||chunk[funcBIndex]=="/")){
                bedmas=[2,funcBIndex]
            }else if(bedmas[0]<3 && (chunk[funcBIndex]=="^")){
                bedmas=[3,funcBIndex]
            }
        }
        

        chunk[bedmas[1]-1] = [solveEquation([chunk[bedmas[1]-1],chunk[bedmas[1]],chunk[bedmas[1]+1]])];
        chunk.splice(1,2);
    }
    return chunk[0][0]

}
function solveEquation(short){//single formula
    if (short[0]=="a"){
        short[0]=uncert1
    }else if (short[0]=="b"){
        short[0]=uncert2
    }
    if (short[2]=="a"){
        short[2]=uncert1
    }else if (short[2]=="b"){
        short[2]=uncert2
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
        if(uncertPos[0]==uncertPos[1]){
            if (uncertPos[0]==0){
                //two numbers
                return parseFloat(short[0])+parseFloat(short[2])
            }else{
                //two uncertainties
                return [parseFloat(short[0][0])+parseFloat(short[2][0]),parseFloat(short[0][1])+parseFloat(short[2][1])]
            }
        }else{
        }

        
    }else if (short[1]=="-"){
        if(uncertPos[0]==uncertPos[1]){
            if (uncertPos[0]==0){
                return short[0]-short[2]
            }else{
                return [short[0][0]-short[2][0],short[0][1]+short[2][1]]
            }
        }else{
        }
    }else if (short[1]=="*"){
        if(uncertPos[0]==uncertPos[1]){
            if (uncertPos[0]==0){
                return short[0]*short[2]
            }else{
                var result = short[0][0]*short[2][0];
                return [result,result*(short[0][1]/short[0][0]+short[2][1]/short[2][0])]
            }
        }else{
            if(uncertPos[0]==0){
                return [short[0]*short[2][0],short[0]*short[2][1]]
            }else{
                return [short[0][0]*short[2],short[0][1]]
            }
        }
    }else if (short[1]=="/"){
        if(uncertPos[0]==uncertPos[1]){
            if (uncertPos[0]==0){
                return short[0]/short[2]
            }else{
                var result = short[0][0]/short[2][0];
                return [result,result*(short[0][1]/short[0][0]+short[2][1]/short[2][0])]
            }
        }else{
            if(uncertPos[0]==0){
                return [short[0]/short[2][0],short[0]/short[2][1]]
            }else{
                return [short[0][0]/short[2],short[0][1]/short[2]]
            }
        }
    }else if (short[1]=="^"){
        if(uncertPos[0]==uncertPos[1]){
            if (uncertPos[0]==0){
                return short[0]^short[2]
            }else{
                return "error";
            }
        }else{
            if(uncertPos[0]==0){
                return "wtf does this mean"
            }else{
                var result = short[0][0]^short[2];
                return [result,result*(short[2]*(short[0][1]/short[0][0]))]
            }
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
    if(terms.length==0){
        return ["error","empty"];
    }
    if(terms.includes("a")){
        if(isNaN(uncert1[0])||isNaN(uncert1[1])){
            return ["error","uncert1-incomplete"]
        }
    }
    if(terms.includes("b")){
        if(isNaN(uncert2[0])||isNaN(uncert2[1])){
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
    if (isNaN(i) && (i!="a"||i!="b")){
        return false
    }
    return true
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
    }else if(!isNaN(terms[termN-1]) && numItems.includes(currentTerm)){
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
    if (termN==terms.length-1 && (operatorsA.includes(currentTerm)||operatorsB.includes(currentTerm))){
        return "endIllegal";
    }
    return "legal";
}
