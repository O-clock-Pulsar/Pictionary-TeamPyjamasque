function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
        $('#avatar-preview').attr('src', e.target.result);
        $('#avatar-preview').addClass('img-thumbnail');
    }

    reader.readAsDataURL(input.files[0]);
    }
}
$("#avatar").change(function() {
    readURL(this);
});