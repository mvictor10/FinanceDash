// auth.js
(function() {
    const isLogged = localStorage.getItem('isLogged');
    if (!isLogged || isLogged !== 'true') {
        // Se tentar acessar sem login, manda para o login.html
        window.location.replace("login.html");
    }
})();

// Função Global de Logout
function logout() {
    if (confirm("Deseja realmente sair?")) {
        localStorage.removeItem('isLogged');
        // replace() apaga a página atual do histórico, aumentando a segurança
        window.location.replace("login.html");
    }
}