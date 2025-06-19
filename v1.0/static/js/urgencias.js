var urgencias = [];
        var currentPage = 1;
        var rowsPerPage = 10;

        function carregarUrgencias() {
            fetch('/api/urgencias')
                .then(response => response.json())
                .then(data => {
                    urgencias = data;
                    mostrarUrgencias();
                })
                .catch(error => console.error('Erro ao carregar as urgências:', error));
        }

        function mostrarUrgencias() {
            var corpoTabela = document.getElementById("corpoTabela");
            var filtroOpcao = document.getElementById("filtroOpcao").value;
            var input = document.getElementById("myInput").value.toUpperCase();
            corpoTabela.innerHTML = "";
        
            var totalUrgencias = 0;
            var filteredUrgencias = urgencias.filter(function(urgencia) {
                var incluirUrgencia = false;
                
                // Verifique qual filtro foi selecionado (mensagem ou escola)
                if (filtroOpcao === "1") {  // Filtro por mensagem
                    if (urgencia.mensagem.toUpperCase().indexOf(input) > -1) {
                        incluirUrgencia = true;
                    }
                } 
                else if (filtroOpcao === "2") {
                    if (urgencia.escola && urgencia.escola.toUpperCase().indexOf(input) > -1) { // Verificar se 'alerta.escola' não é null ou undefined
                        incluirUrgencia = true;
                    }
                }
                
                if (incluirUrgencia) totalUrgencias++;
                return incluirUrgencia;
            });
        
            atualizarPaginacao(filteredUrgencias.length);
        
            var startIndex = (currentPage - 1) * rowsPerPage;
            var endIndex = startIndex + rowsPerPage;
            for (var i = startIndex; i < endIndex && i < filteredUrgencias.length; i++) {
                var urgencia = filteredUrgencias[i];
                var row = document.createElement("tr");
        
                //var statusAlertado = urgencia.status ? "Sim" : "Não";  // "Sim" ou "Não" se alertado
                
                row.innerHTML = "<td><input type='checkbox'></td>" +
                    "<td>" + urgencia.mensagem + "</td>" +
                    "<td>" + urgencia.relevancia + "</td>" +
                    "<td>" + (urgencia.escola || 'Não especificada') + "</td>" +
                    "<td>" + urgencia.solicitante + "</td>" +
                    "<td>" + formatarData(urgencia.data_hora) + "</td>" +
                    "<td>" + urgencia.status + "</td>" + 
                    "<td><span class='material-symbols-outlined btn_editar' data-alerta-id='" + urgencia.id + "'>edit</span></td>";
        
                corpoTabela.appendChild(row);
            }
        
            document.getElementById("quantidadeUrgencias").innerText = "Quantidade de Urgências: " + totalUrgencias;
        
            editarUrgencia();
        }
        
        // Função para formatar a data
        function formatarData(data) {
            var date = new Date(data);
            var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return date.toLocaleDateString('pt-BR', options);
        }

       
        function editarUrgencia() {
            document.querySelectorAll('.btn_editar').forEach(function(btn) {
                btn.addEventListener('click', function(event) {
                    event.preventDefault();  // Prevent default button behavior
        
                    //const alertaId = btn.getAttribute('data-alerta-id');  // Alterar para 'data-alerta-id'
                    const usuarioId = btn.getAttribute('data-usuario-id');
        
                    // Redirect to the edit page with the alerta ID
                    window.location.href = `/user/usuarios/usuario/${usuarioId}`;
                    //window.location.href = `/alertas/editar/${alertaId}`;  // Corrigir o caminho, se necessário
                });
            });
        }
        

        // Função para limpar o campo de pesquisa ao trocar o filtro
        document.getElementById('filtroOpcao').addEventListener('change', function() {
            var inputPesquisa = document.getElementById('myInput');
            
            // Limpar o campo de pesquisa ao trocar o filtro
            inputPesquisa.value = '';

            // Atualizar o placeholder conforme o filtro selecionado
            if (this.value == "1") {
                inputPesquisa.placeholder = "Pesquisar por Urgência...";
            } 
            else if (this.value == "2") {
                inputPesquisa.placeholder = "Pesquisar por Escola...";
            } 
            
            // Atualizar a tabela após mudar o filtro
            //filtrarTabela();
        });

        function atualizarPaginacao(totalRows) {
            var paginacao = document.getElementById("paginacao");
            var totalPages = Math.ceil(totalRows / rowsPerPage);
            paginacao.innerHTML = "";
            for (var i = 1; i <= totalPages; i++) {
                var link = document.createElement("a");
                link.href = "#";
                link.innerText = i;
                if (i === currentPage) {
                    link.className = "active";
                }
                link.onclick = function() {
                    currentPage = parseInt(this.innerText);
                    mostrarUrgencias();
                };
                paginacao.appendChild(link);
            }
        }

        function filtrarTabela() {
            currentPage = 1;
            mostrarUrgencias();
        }

        carregarUrgencias();
