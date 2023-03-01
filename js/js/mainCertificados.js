let app = new Vue({
    el: '#app',

    data: {
        cert: {},
        operacaoAddEdit: null,
        pwCert: "",
        retornoCert: "",
        selectedId: null,
        dataNotificacaoEmpresa: null,
        dataNotificacaoUser: null,
        pw1: '',
        pw2: '',
        retornoAlteracaoSenha: null

    }, methods: {
        openDeleteModal: function (id) {
            this.selectedId = id;
        }, openNotificationModal(dataNotificacaoEmpresa, dataNotificacaoUser) {
            this.dataNotificacaoEmpresa = dataNotificacaoEmpresa
            this.dataNotificacaoUser = dataNotificacaoUser

        }, setOperacao: function (operacao) {
            this.operacaoAddEdit = operacao;
        },
        edit: function (id) {
            this.setOperacao('Editar');
            axios
                    .get('/certificado/' + id)
                    .then(response => {
                        this.cert = response.data
                    })
        },
        add: function () {
            this.setOperacao('Adicionar');
            this.cert = {};
        },
        upCertificate() {
            let formData = new FormData();
            let certificateFile = document.querySelector('#fileCert');
            formData.append("file", certificateFile.files[0]);
            formData.append("password", this.pwCert);
            axios.post("/certificado/upload?" + csrf.parameterName + "=" + csrf.token, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                console.log(response.data.certificado)
                this.retornoCert = response.data.retorno;
                this.cert = response.data.certificado;
            })
        }, toLocalDate(date) {
            if (!date)
                return ''
            let nData = new Date(date)
            return  nData.toLocaleDateString('pt-BR', {timeZone: 'UTC'})
        }, submitAterPassword() {
            this.retornoAlteracaoSenha = null
            if (this.validarSenha(this.pw1, this.pw2)) {
                axios.post("/user/newpw?" + csrf.parameterName + "=" + csrf.token + '&pw1=' + this.pw1 + '&pw2=' + this.pw2).then(res => {
                   location.reload();
                }).catch(err => {
                    console.log(err.response)
                    this.retornoAlteracaoSenha = err.response.data
                });

            }
        }, validarSenha(pw1, pw2) {
            if (pw1 == pw2) {
                return true;
            } else {
                this.retornoAlteracaoSenha = "As senhas devem coincidir";
                return false;
            }
        }
    }
})
$(document).ready(function () {
    $(".retorno").show("slow")
    $(".retorno").delay(2000).fadeOut(500);
});









