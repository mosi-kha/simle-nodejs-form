$(document).ready(function () {
    $('#search_id').on('keyup keypress', function (e) {
        //disable enter
        let keyCode = e.keyCode || e.which;
        if (keyCode == '13') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        let searchField = $('#search_id').val();
        $.ajax({
            url: '/forms?search=' + searchField,
            type: 'GET',
            success: function (result) {

                let div = document.getElementById('list_all');
                div.innerHTML = result;
            }
        });
    });
});
