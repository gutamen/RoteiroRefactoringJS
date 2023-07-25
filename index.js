const { readFileSync } = require('fs');

// função extraída
function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",{ style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(valor/100);
}

// função query
function getPeca(apresentacao) {
    return pecas[apresentacao.id];
}
    

function calcularTotalApresentacao(apre) {
    let total = 0;
    let peca = getPeca(apre);
    switch (peca.tipo) {

    case "tragedia":
    total = 40000;
    if (apre.audiencia > 30) {
        total += 1000 * (apre.audiencia - 30);
    }
    break;
        
    case "comedia":
    total = 30000;
    if (apre.audiencia > 20) {
        total += 10000 + 500 * (apre.audiencia - 20);
    }
    total += 300 * apre.audiencia;
    break;

    default:
        throw new Error(`Peça desconhecia: ${peca.tipo}`);
    }

    return total;
}
    
// créditos para próximas contratações
function calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(apre).tipo === "comedia") 
        creditos += Math.floor(apre.audiencia / 5);
    return creditos;   
}

function calcularTotalFatura(apresentacoes){
    let total = 0;
    for(let apre of apresentacoes){
        total += calcularTotalApresentacao(apre);
    }
    return total;
}

function calcularTotalCreditos(apresentacoes){
    let total = 0;
    for(let apre of apresentacoes){
        total += calcularCredito(apre);
    }
    return total;
}

    
function gerarFaturaStr (fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${getPeca(apre).nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos(fatura.apresentacoes)} \n`;
    return faturaStr;
}

function gerarFaturaHTML(fatura, pecas){
    let faturaStr = `<html>\n<p>Fatura ${fatura.cliente}</p>\n<ul>\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `<li>  ${getPeca(apre).nome}: ${formatarMoeda(calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)</li>\n`;
    }
    faturaStr += '</ul>\n'
    faturaStr += `<p> Valor total: ${formatarMoeda(calcularTotalFatura(fatura.apresentacoes))}</p>\n`;
    faturaStr += `<p> Créditos acumulados: ${calcularTotalCreditos(fatura.apresentacoes)}</p>\n`;
    faturaStr += '</html>\n'
    return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaHTML(faturas, pecas);
console.log(faturaStr);
