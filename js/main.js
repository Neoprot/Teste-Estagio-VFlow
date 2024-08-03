$(document).ready(function () {
    if (window.eventsBound) return;
    window.eventsBound = true;

    let anexoFiles = [];
    let produtoCounter = 0; // Contador de produtos

    // Adicionar novo produto
    $(document).on('click', '#addProduto', function () {
        produtoCounter++; // Incrementa o contador de produtos
        let productTemplate = `
        <div class="fs-display-flex fs-align-items-center produto-item">
            <div class="form-group fs-display-flex fs-margin-left-auto col-md-1">
                <button type="button" class="btn btn-danger btn-remove-produto"><img src="style-guide/images/illustrations/delete.svg" class="img-remove-produto illustration illustration-xs" alt="Excluir Produto"></button>
            </div>
            <div class="panel panel-default col-md-11">
                <div class="panel-heading fs-no-bg">
                    <h3 class="panel-title">Produto - <span class="produto-indice">${produtoCounter}</span></h3>
                </div>
                <div class="form-row panel-body">
                    <div class="form-group col-md-2">
                        <img src="/style-guide/images/illustrations/package-diagram.svg" class="illustration illustration-package-diagram illustration-xl" title="package-diagram">
                    </div>
                    <div class="form-group col-md-10">
                        <label>Produto</label>
                        <input type="text" class="form-control produtoDescricao" required>
                    </div>
                    <div class="form-group col-md-2">
                        <label>UND. Medida</label>
                        <select class="form-control produtoUnidade" required>
                            <option value="">Selecione</option>
                            <option value="kg">Kg</option>
                            <option value="un">Unidade</option>
                        </select>
                    </div>
                    <div class="form-group col-md-3">
                        <label>QTD. em Estoque</label>
                        <input type="number" class="form-control produtoQtde" required>
                    </div>
                    <div class="form-group col-md-3">
                        <label>Valor Unitário</label>
                        <input type="number" class="form-control produtoValor" step="0.01" required>
                    </div>
                    <div class="form-group col-md-2">
                        <label>Valor Total</label>
                        <input type="number" class="form-control produtoTotal" readonly>
                    </div>
                </div>
            </div>
        </div>`;
        $('#produtosContainer').append(productTemplate);
    });

    // Remover produto
    $(document).on('click', '.btn-remove-produto', function () {
        $(this).closest('.produto-item').remove();
        produtoCounter--;
    });

    // Adicionar novo anexo
    $(document).on('click', '#addAnexo', function () {
        let anexoTemplate = `
        <div class="anexo-item">
            <div class="form-group col-md-1 d-flex fs-lg-margin-top">
                <button type="button" class="btn btn-danger btn-remove-anexo"><img src="style-guide/images/illustrations/delete.svg" class="illustration illustration-xs" alt="Excluir Anexo"></button>
            </div>
            <div class="form-group col-md-1 d-flex fs-lg-margin-top">
                <button type="button" class="btn btn-info btn-view-anexo"><img src="style-guide/images/illustrations/visualize.svg" class="illustration illustration-xs" alt="Vizualizar Anexo"></button>
            </div>
            <div class="form-row">
                <div class="form-group col-md-10">
                    <label>Documento anexo</label>
                    <input type="file" class="form-control anexoDocumento input-lg" required>
                </div>
            </div>
        </div>`;
        $('#anexosContainer').append(anexoTemplate);
    });

    // Remover anexo
    $(document).on('click', '.btn-remove-anexo', function () {
        $(this).closest('.anexo-item').remove();
    });

    // Visualizar anexo
    $(document).on('click', '.btn-view-anexo', function () {
        let fileInput = $(this).closest('.anexo-item').find('.anexoDocumento')[0];
        if (fileInput.files.length > 0) {
            let file = fileInput.files[0];
            let url = URL.createObjectURL(file);
            let a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    // Calcular valor total
    $(document).on('input', '.produtoQtde, .produtoValor', function () {
        let item = $(this).closest('.produto-item');
        let qtde = item.find('.produtoQtde').val();
        let valor = item.find('.produtoValor').val();
        let total = qtde * valor;
        item.find('.produtoTotal').val(total.toFixed(2));
    });

    // Evento para o botão Salvar Fornecedor
    $(document).on('click', '#salvarFornecedor', function (event) {
        event.preventDefault();
        let isValid = true;

        // Verifica todos os campos required no formulário
        $('#formFornecedor [required]').each(function () {
            let formGroup = $(this).closest('.form-group');
            if ($(this).val() === '') {
                isValid = false;
                formGroup.addClass('has-error'); // Adiciona classe de erro
            } else {
                formGroup.removeClass('has-error'); // Remove classe de erro se preenchido
            }
        });

        // Verifica todos os campos required nos produtos
        $('#produtosContainer .produto-item [required]').each(function () {
            let formGroup = $(this).closest('.form-group');
            if ($(this).val() === '') {
                isValid = false;
                formGroup.addClass('has-error'); // Adiciona classe de erro
            } else {
                formGroup.removeClass('has-error'); // Remove classe de erro se preenchido
            }
        });

        // Verifica todos os campos required nos anexos
        $('#anexosContainer .anexo-item [required]').each(function () {
            let formGroup = $(this).closest('.form-group');
            if ($(this).val() === '') {
                isValid = false;
                formGroup.addClass('has-error'); // Adiciona classe de erro
            } else {
                formGroup.removeClass('has-error'); // Remove classe de erro se preenchido
            }
        });

        if (!isValid) {
            alert("Por favor, preencha todos os campos obrigatórios."); // Exibe o alerta de erro
            return;
        }
        // Coletar dados do formulário
        let formData = {
            razaoSocial: $('#razaoSocial').val(),
            nomeFantasia: $('#nomeFantasia').val(),
            cnpj: $('#cnpj').val(),
            inscricaoEstadual: $('#inscricaoEstadual').val(),
            inscricaoMunicipal: $('#inscricaoMunicipal').val(),
            endereco: $('#endereco').val(),
            numero: $('#numero').val(),
            complemento: $('#complemento').val(),
            bairro: $('#bairro').val(),
            municipio: $('#municipio').val(),
            estado: $('#estado').val(),
            nomeContato: $('#nomeContato').val(),
            telefone: $('#telefone').val(),
            email: $('#email').val(),
            produtos: [],
            anexos: []
        };

        // Coletar dados dos produtos
        $('#produtosContainer .produto-item').each(function (index, element) {
            let produto = {
                indice: index + 1,
                descricaoProduto: $(element).find('.produtoDescricao').val(),
                unidadeMedida: $(element).find('.produtoUnidade').val(),
                qtdeEstoque: $(element).find('.produtoQtde').val(),
                valorUnitario: $(element).find('.produtoValor').val(),
                valorTotal: $(element).find('.produtoTotal').val()
            };
            formData.produtos.push(produto);
        });

        // Coletar dados dos anexos
        let filesProcessed = 0;
        let totalFiles = $('#anexosContainer .anexo-item').length;
        $('#anexosContainer .anexo-item').each(function (index, element) {
            let fileInput = $(element).find('.anexoDocumento')[0];
            if (fileInput.files.length > 0) {
                let file = fileInput.files[0];
                let reader = new FileReader();
                reader.onload = function (e) {
                    let anexo = {
                        indice: index + 1,
                        nomeArquivo: file.name,
                        conteudoArquivo: e.target.result
                    };
                    formData.anexos.push(anexo);
                    filesProcessed++;
                    if (filesProcessed === totalFiles) {
                        // Submeter os dados do formulário
                        enviarDadosFormulario(formData);
                    }
                };
                reader.readAsDataURL(file);
            } else {
                filesProcessed++;
            }
        });

        if (totalFiles === 0) {
            enviarDadosFormulario(formData);
        }
    });

    // Função para enviar dados do formulário
    function enviarDadosFormulario(formData) {
        console.log(formData);
        // Aqui você pode enviar os dados para o backend ou realizar outra ação desejada

        // exibir mensagem de sucesso
        alert("Dados enviados com sucesso!");
    }
    $(document).on('blur', '#cep', function () {
        let cep = $(this).val().replace(/\D/g, '');
        if (cep != "") {
            $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function (data) {
                if (!("erro" in data)) {
                    $('#endereco').val(data.logradouro);
                    $('#bairro').val(data.bairro);
                    $('#municipio').val(data.localidade);
                    $('#estado').val(data.uf);
                } else {
                    alert("CEP não encontrado.");
                }
            });
        }
    });
});
