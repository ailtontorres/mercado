/* Declarção de Variáveis */
var enderecoProduto = "https://atorres-mercado.azurewebsites.net/Produto/Produto/";
var produto;
var compra = [];
var __totalVenda__ = 10.0;

/* Inicio */
$("#posvenda").hide();
atualizarTotal();

/* Funções */
function atualizarTotal(){
    $("#totalVenda").html(__totalVenda__);
}

function preencherFormulario(dadosProduto) {
    console.log(dadosProduto);
    $("#campoNome").val(dadosProduto.nome);
    $("#campoCategoria").val(dadosProduto.categoria.nome);
    $("#campoFornecedor").val(dadosProduto.fornecedor.nome);
    $("#campoPreco").val(dadosProduto.precoDeVenda);
    $("#campoMedicao").val(dadosProduto.medicao);
}

function zerarFormulario() {
    $("#campoNome").val("");
    $("#campoCategoria").val("");
    $("#campoFornecedor").val("");
    $("#campoPreco").val("");
    $("#campoMedicao").val("");
    $("#campoQuantidade").val("");
}

function adicionarProduto(p, q) {

    var produtoTemp = {};
    Object.assign(produtoTemp, produto);

    var venda = {produto: produtoTemp, quantidade: q, subtotal: produtoTemp.precoDeVenda * q};

    __totalVenda__ += venda.subtotal;
    atualizarTotal();

    compra.push(venda);

    $("#compras").append(
            `<tr>
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>${q}</td>
                <td>${p.precoDeVenda}</td>
                <td>${p.medicao}</td>
                <td>${p.precoDeVenda * q}</td>
                <td><button class='btn btn-danger'>Remover</button></td>
            </tr>`
        );
}

/* Ajax */

$("#pesquisar").click(function() {

    var codProduto = $("#codProduto").val();
    var url = enderecoProduto + codProduto;

    $.post(url, function(dados, status) {
        produto = dados;

        var med = "";
        switch (produto.medicao) {
            case 0:
                med = "L";
                break;
            case 1:
                med = "K";
                break;
            case 2:
                med = "U";
                break;
            default:
                med = "U";
                break;
        }

        produto.medicao = med;

        preencherFormulario(produto);
    }).fail(function() {
        alert("Produto não encontrado");
    });
});

$("#produtoForm").on("submit", function(event) {
    event.preventDefault();

    var produtoParaTabela = produto;
    var qtd = $("#campoQuantidade").val();

    adicionarProduto(produto, qtd);

    produto = undefined;
    zerarFormulario();

});

/* Finalização da Venda */

$("#finalizarVendaBTN").click(function(){
    if (__totalVenda__ <= 0) {
        alert("Compra inválida. Nenhum produto adicionado.")
        return;
    }

    var _valorPago = $("#valorPago").val();
    if (!isNaN(_valorPago)) {
        _valorPago = parseFloat(_valorPago);

        if (_valorPago >= __totalVenda__) {
            var troco = _valorPago - __totalVenda__;
            $("#troco").val(troco);        
            
            $("#posvenda").show();
            $("#prevenda").hide();

            $("#valorPago").prop("disabled", true);
            
        }
        else {
            alert("Valor pago insuficiente");
            return;
        }
    }
    else {
        alert("Valor pago inválido");
        return;
    }
});