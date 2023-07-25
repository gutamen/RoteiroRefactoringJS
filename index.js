const { readFileSync } = require('fs');

// função extraída
function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR",{ style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(valor/100);
}

// função query
//function getPeca(apresentacao) {
  //  return pecas[apresentacao.id];
//}

class Repositorio {
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }
}
    
class ServicoCalculoFatura{
    constructor(repo) {
        this.repo = repo;
    }

    calcularTotalApresentacao(apre) {
        let total = 0;
        let peca = this.repo.getPeca(apre);
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
    calcularCredito(apre) {
        let creditos = 0;
        creditos += Math.max(apre.audiencia - 30, 0);
        if (this.repo.getPeca.tipo === "comedia") 
            creditos += Math.floor(apre.audiencia / 5);
        return creditos;   
    }

    calcularTotalFatura(apresentacoes){
        let total = 0;
        for(let apre of apresentacoes){
            total += this.calcularTotalApresentacao(apre);
        }
        return total;
    }

    calcularTotalCreditos(apresentacoes){
     let total = 0;
        for(let apre of apresentacoes){
            total += this.calcularCredito(apre);
        }
        return total;
    }
}
    
function gerarFaturaStr (fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)} \n`;
    return faturaStr;
}

function gerarFaturaHTML(fatura, calc){
    let faturaStr = `<html>\n<p>Fatura ${fatura.cliente}</p>\n<ul>\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `<li>  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)</li>\n`;
    }
    faturaStr += '</ul>\n'
    faturaStr += `<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura.apresentacoes))}</p>\n`;
    faturaStr += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura.apresentacoes)}</p>\n`;
    faturaStr += '</html>\n'
    return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
