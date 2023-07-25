const { readFileSync } = require('fs');

// função extraída
//function formatarMoeda(valor) {
  //  return new Intl.NumberFormat("pt-BR",{ style: "currency", currency: "BRL", minimumFractionDigits: 2 }).format(valor/100);
//}

// função query
//function getPeca(apresentacao) {
  //  return pecas[apresentacao.id];
//}

const formatarMoeda = require("./utils.js");
const gerarFaturaStr = require("./apresentacao.js");
var Repositorio = require("./repositorio.js");
var ServicoCalculoFatura = require("./servico.js"); 
    

const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio());
const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);
