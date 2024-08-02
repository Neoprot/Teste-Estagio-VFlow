$(document).ready(function () {
    let anexoFiles = [];

    // Add new product
    $('#addProduto').click(function () {
        let productTemplate = `
        <div class="produto-item fs-lg-margin-bottom">
            <div class="form-row">
                <div class="form-group col-md-6">
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
                <div class="form-group col-md-2">
                    <label>QTD. em Estoque</label>
                    <input type="number" class="form-control produtoQtde" required>
                </div>
                <div class="form-group col-md-2">
                    <label>Valor Unitário</label>
                    <input type="number" class="form-control produtoValor" step="0.01" required>
                </div>
                <div class="form-group col-md-2">
                    <label>Valor Total</label>
                    <input type="number" class="form-control produtoTotal" readonly>
                </div>
                <div class="form-group col-md-offset-6 col-md-1 fs-display-flex fs-align-items-flex-end">
                    <button type="button" class="btn btn-danger btn-remove-produto">Excluir</button>
                </div>
            </div>
        </div>`;
        $('#produtosContainer').append(productTemplate);
    });

    // Remove product
    $(document).on('click', '.btn-remove-produto', function () {
        $(this).closest('.produto-item').remove();
    });

    // Add new attachment
    $('#addAnexo').click(function () {
        let anexoTemplate = `
        <div class="anexo-item fs-lg-margin-bottom">
            <div class="form-row">
                <div class="form-group col-md-10">
                    <label>Documento anexo</label>
                    <input type="file" class="form-control anexoDocumento" required>
                </div>
                <div class="form-group col-md-1 d-flex align-items-end">
                    <button type="button" class="btn btn-danger btn-remove-anexo">Excluir</button>
                </div>
                <div class="form-group col-md-1 d-flex align-items-end">
                    <button type="button" class="btn btn-primary btn-view-anexo">Visualizar</button>
                </div>
            </div>
        </div>`;
        $('#anexosContainer').append(anexoTemplate);
    });

    // Remove attachment
    $(document).on('click', '.btn-remove-anexo', function () {
        $(this).closest('.anexo-item').remove();
    });

    // View attachment
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

    // Calculate total value
    $(document).on('input', '.produtoQtde, .produtoValor', function () {
        let item = $(this).closest('.produto-item');
        let qtde = item.find('.produtoQtde').val();
        let valor = item.find('.produtoValor').val();
        let total = qtde * valor;
        item.find('.produtoTotal').val(total.toFixed(2));
    });

    // Form submission
    $('#formFornecedor').submit(function (event) {
        event.preventDefault();
        $('#loadingModal').modal('show');

        // Gather form data
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

        // Gather products data
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

        // Gather attachments data
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
                        blobArquivo: e.target.result
                    };
                    formData.anexos.push(anexo);

                    // Check if all files are processed
                    filesProcessed++;
                    if (filesProcessed === totalFiles) {
                        // Output the result
                        console.log(JSON.stringify(formData, null, 2));
                        $('#loadingModal').modal('hide');
                    }
                };
                reader.readAsDataURL(file);
            } else {
                // If no files, still need to increment the counter
                filesProcessed++;
                if (filesProcessed === totalFiles) {
                    // Output the result
                    console.log(JSON.stringify(formData, null, 2));
                    $('#loadingModal').modal('hide');
                }
            }
        });
        console.log(JSON.stringify(formData, null, 2));
    });

    // Fetch address by CEP
    $('#cep').blur(function () {
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
