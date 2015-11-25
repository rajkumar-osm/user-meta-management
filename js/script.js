jQuery(document).ready(function ($) {
    var metaInformation = [];
    var userId;
    $('#usersMeta').dataTable({
        "dom": '<"top">rt<"bottom" pl>',
        "order": [[ 0, "asc" ]],
        'scrollX': true,
        "autoWidth": false
    });


    $('#submitMeta').click(function (e) {
        e.preventDefault();
        if ($('#txtMetaKey').val() !== '') {
            getMetaMatchLIst();

        } else {
            $('#txtMetaKey').addClass('error');
        }
    });

    $('body').on('click', '.user-mail', function (e) {
        e.preventDefault();
        jQuery('.user-meta-results').html('');
        userId = +($($(this).parents('tr').find('#userId')).html());
        getUserMetaInformation();
    });

    $('body').on('click', '#imgClose', function () {
        jQuery('.user-meta-information').hide();
    });
    
    $('body').on('click', '#updateUserMetaInformation', function () {
        var updateMetaInformation = [];
        var updatedMetaData = {};
        for (var i = 1; i < jQuery('#userMetaInformation tr').length; i++) {
            var key = jQuery(jQuery(jQuery('#userMetaInformation tr')[i]).find('input')[0]).val();
            var value = jQuery(jQuery(jQuery('#userMetaInformation tr')[i]).find('input')[1]).val();
            updateMetaInformation[key] = value;
        }
        for (var key in updateMetaInformation) {
            if (metaInformation[key] !== updateMetaInformation[key]) {
                updatedMetaData[key] = updateMetaInformation[key];
            }
        }
        var data = {
            'action': 'update_user_meta_data',
            'userId': userId,
            'userMetaData': updatedMetaData
        };
        ajaxCall(data,showMessage);


    });

    $('body').on('click', '#addUserMetaInformation', function () {
        addMetaKeyValue();
    });

    $('body').on('click', '#deleteUserMetaInformation', function () {
        deleteUserMetaInformation();
    });

    function showMessage(data){
	    var json=JSON.parse(data);
	jQuery('#myModal').modal('hide');
	console.log(json.error);
	if(json['error']){
	    var container= jQuery('#modalnfo').find('.modal-body');
	    jQuery(container).html(json['error']);
	    jQuery('#modalnfo').modal('show');    
	}
	else{
	var container= jQuery('#modalSuccess').find('.modal-body');
	jQuery(container).html(json['success']);
	jQuery('#modalSuccess').modal('show');
}
    }
    // Function to get the user meta information.
    function  getUserMetaInformation() {
        var data = {
            action: "get_user_meta_details",
            "userId": userId
        };
//        getMetaMatchLIst();
        ajaxCall(data, showMetaDetails);
    }

    // Function to delete the User meta information from the meta list available..
    function deleteUserMetaInformation() {
        if (jQuery('#deleteUserMetaInformation').hasClass('delete-meta')) {
            jQuery('#deleteUserMetaInformation').removeClass('delete-meta');
            var deleteMetaInformation = {};
            for (var i = 1; i < jQuery('#userMetaInformation tr').length; i++) {
                var check = jQuery(jQuery(jQuery('#userMetaInformation tr')[i]).find('input:checked'));
                if (check.length) {
                    var key = jQuery(jQuery(jQuery('#userMetaInformation tr')[i]).find('input')[0]).val();
                    var value = jQuery(jQuery(jQuery('#userMetaInformation tr')[i]).find('input')[1]).val();
                    deleteMetaInformation[key] = value;
                }
            }
            var data = {
                'action': 'delete_user_meta',
                'userId': userId,
                'userMetaData': deleteMetaInformation
            };
            ajaxCall(data, showMessage);
        } else {
            jQuery('#deleteUserMetaInformation').addClass('delete-meta');
            for (var i = 1; i < jQuery('#userMetaInformation tr').length; i++) {
                jQuery(jQuery(jQuery('#userMetaInformation tr')[i]).find('td')[2]).remove();
            }
            appendCheckBoxes();
        }
    }

// Function to shoe the user meta details.
    function showMetaDetails(result) {
        metaInformation = [];
        jQuery('#userMetaInformation').DataTable().destroy();
        jQuery('#userMetaDetails').html(result);
        jQuery('#myModal').modal('show');
        jQuery('.user-meta-information').show();
        jQuery('#userMetaInformation').dataTable({
            "dom": '<"top">rt<"bottom">',
//            "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
//            'scrollY': true,
//            "autoWidth": false
"autoWidth": false,
            "scrollY": "400px",
            "scrollCollapse": true,
            "paging": false
        });

        for (var i = 1; i < jQuery('#userMetaInformation tr').length; i++) {
            var key = jQuery(jQuery(jQuery('#userMetaInformation tr')[i]).find('input')[0]).val();
            var value = jQuery(jQuery(jQuery('#userMetaInformation tr')[i]).find('input')[1]).val();
            metaInformation[key] = value;
        }
    }
    
    // Function to show the meta information of the user.
    function showmetaLIst(result) {     	    
        jQuery('#usersMeta').DataTable().destroy();
        jQuery('.user-meta-information').remove();
        jQuery('.meta-results').html('');
        jQuery('.meta-table-results').html(result);
        jQuery('.user-meta-information').show();
       $('#usersMeta').dataTable({
	"dom": '<"top">rt<"bottom" pl>',
	"order": [[ 0, "asc" ]], '\
	 scrollX': true,
	"autoWidth": false
	});
        
//        jQuery('#userMetaInformation').DataTable({
//            "dom": '<"top">rt<"bottom" pl>',
//            'scrollX': true,
//            "autoWidth": false
//        });
    }

    // Function to get the list of users who has meta key and value matched.
    function getMetaMatchLIst() {
        jQuery('#txtMetaKey').removeClass('error');
        var metakey = jQuery('#txtMetaKey').val();
        var metaValue = jQuery('#txtMetaValue').val();
        var data = {
            action: "meta_search",
            "metaKey": metakey,
            "metaValue": metaValue
        };
        ajaxCall(data, showmetaLIst);
    }

// Function to make a ajax call
    function ajaxCall(data, cbFunction, chidCbFunc) {
        jQuery.ajax({
            url: myAjax.ajaxurl,
            type: "post",
            data: data,
            success: function (result) {
                if (chidCbFunc) {
                    chidCbFunc();
                }
                cbFunction(result);
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    }

// Function to append the check boxes.
    function appendCheckBoxes() {
        var checkboxContent = '<td><input  type="checkbox" name="meta[]"></td>';
        for (var i = 1; i < jQuery('#userMetaInformation tr').length; i++) {
            jQuery(jQuery(jQuery('#userMetaInformation tr')[i])).append(checkboxContent);
        }
    }
// Function to append the new meta key and value to the existing meta information.
    function addMetaKeyValue() {
        for (var i = 1; i < jQuery('#userMetaInformation tr').length; i++) {
            var check = jQuery(jQuery(jQuery('#userMetaInformation tr')[i]).find('input[name="meta[]"]'));
            if (check.length) {
               jQuery(jQuery(jQuery('#userMetaInformation tr')[i]).find('td')[2]).hide();
            }
        } jQuery('#deleteUserMetaInformation').removeClass('delete-meta');
        var appendContent = '<tr><td><input type="text" placeholder="  Meta key....."></td>';
        appendContent += '<td><input type="text" placeholder=" Meta value...." </td></tr>';
        jQuery('#userMetaInformation').append(appendContent);
    }
});