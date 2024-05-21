$(function(){
    $('table').DataTable({
        order: [0, 'desc']
    });

    $('.dt-length').children().eq(1).text('Itens por página');
    $('.dt-search').children().eq(0).text('Buscar');
    
});