$(document).ready(function() {
    $('.parent').hover(
        function() {
            $(this).find('img').removeClass('hidden');
            $(this).removeClass('border-purple-500')
            

        },
        function() {

            $(this).find('img').addClass('hidden');
            $(this).removeClass('border-blue-300')
            $(this).addClass('border-purple-400')
        }
    );

    $('.wakfu').click(function(){
        window.location.href = 'wakfu.html';
      });



});