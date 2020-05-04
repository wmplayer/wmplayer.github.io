//regexp ["$1", "$2"],

function tabs(count){
    return ("\r\n" + "-".repeat(count));
}

function expand(reagent, entrancy)
{
    if (typeof entrancy == "number") entrancy++;
    else entrancy = 0;
    if (typeof reagent == "object")
    {
        if (typeof reagent[1] == "number") return reagent[0];
        let retval = tabs(entrancy) + reagent[0] + "(";
        let subvals = reagent[1].split(" + ");
        subvals.forEach(subval => retval += expand(subval, entrancy));
        return retval + ")";
    }
    else if (typeof reagent == "string")
    {
        return expand([reagent, g_mapcombos[reagent]], entrancy);
    }
    return reagent;
}

function reduce(reagent)
{
    let retval = "";
    if (typeof reagent == "string")
    {
        let subagents = reagent.split(" + ");
        subagents.forEach(item => retval += reduce(item));
        return retval;
    }
    return reagent;
}

function printAll(combos, outputdiv)
{
    let outspew = "";
    combos.forEach(
        item => 
        {
            outspew += expand(item);
            //outspew += (item[0] + " = " + item[1] + "\r\n")
        });
    outputdiv.value += outspew;
}

