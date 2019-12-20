var color_scale = [];
var color_ramp = [];
var color_ramp_domain = [];

function generate_scale(base_color, classes, gamma, start) {
    color_scale.length = 0;
    for (i=0;i<classes;++i) {
        color_scale.push(0);   
    }
    $(".range-value").each(function(){
        $(this).text($(this).prev().val());
    });
    $(".color-block, .color-swatch, #color-list").remove();
    $(".notes").html("Click a swatch to copy its hex code as text. <a href='#'>Or, generate a list.</a>");
    $("#color_input").after("<span class='color-swatch' style='background-color:"+$("#color_input").val()+"'></span>"); 
    switch(start){
        case "0":
            if (classes == 1) {
                    color_scale[0] = base_color;
            } else {
                for (i=0;i<classes-1;++i){
                    color_scale[0] = base_color;
                    color_scale[i + 1] = d3.hcl(color_scale[i]).darker(gamma/20);
                }
            }
            break;
        case "1":
            var middle = Math.floor(color_scale.length / 2);
            color_scale[middle] = base_color;
            for (i=0;i<middle;++i){
                if (i+middle != classes-1) {
                    color_scale[middle + (i + 1)] = d3.hcl(color_scale[middle + i]).brighter(gamma/10);
                }
                color_scale[middle - (i + 1)] = d3.hcl(color_scale[middle - i]).darker(gamma/10);
                
            }

            break;     
        case "2":
            if (classes == 1) {
                    color_scale[0] = base_color;
            } else {
                for (i=0;i<classes-1;++i){
                    color_scale[0] = base_color;
                    color_scale[i + 1] = d3.hcl(color_scale[i]).brighter(gamma/20); 
                }
            }
            break;
    }  
    $(color_scale).each(function(i){
        $("#color_results").append("<div class='color-block colors-"+classes+"' id='color-"+i+"' data-title='"+d3.hcl(this).toString()+"' style='background-color:"+d3.hcl(this).toString()+"'>"+d3.hcl(this).toString()+"</div>"); 
    });
    $(".color-block").tipper({direction: 'top'});
    $(".color-block").on("click",function(){
        if ($(this).hasClass("active")) {
            $(".color-block").removeClass("active");
            $(".notes").html("Click a swatch to copy its hex code as text. <a href='#'>Or, generate a list.</a>");
        } else {
            $(".color-block").removeClass("active");
            $(this).addClass("active");
            $(".notes").text($(this).text());
        }
    });
    $(".notes a").on("click",function(e){
        e.preventDefault();
        if ($("ul#color-list").length == 0) {
            $("ul#color-list").remove();
            $(".notes").after("<ul id='color-list'></ul>");
            $(".tab.active .color-block, .tab.active .color-block-rfe").each(function(){
                $(".tab.active #color-list").append("<li>"+$(this).text()+"</li>");
            });
        } else {
            $("ul#color-list").remove();
        }
    });
    $(".color-swatch").on("click", function(){
        if ($("#color-palette").hasClass("active")) {
            $("#color-palette").removeClass("active").fadeOut(200);
        } else {
            $("#color-palette").addClass("active").fadeIn(200);
        }
    });
    $("#color-palette a").on("click", function(e){
        e.preventDefault();
        $("#color_input").val($(this).text()).trigger("change");
        $("#color-palette").removeClass("active").fadeOut(200);
    });
    $("#color-palette .color-custom input").on("change", function(){
        $("#color_input").val($(this).val()).trigger("change");
        $("#color-palette").removeClass("active").fadeOut(200);
    });
}

function generate_rfe(classnum){
    $("#color-ramp .color-swatch").remove();
    //$(".color_input_ramp").each(function(){
    //        $(this).after("<span class='color-swatch' style='background-color:"+$(this).val()+"'></span>");
    //});
    $(".color-block-rfe, .color-swatch-rfe, #color-list-rfe").remove();
    $(".range-value").each(function(){
        $(this).text($(this).prev().val());
    });
    color_ramp.length = 0;
    for (i=0;i<$(".color-ramp-item").length;++i) {
        color_ramp.push($(".color-ramp-item").eq(i).find("input").val());   
    }
    color_ramp_domain.length = 0;
    for (i=0;i<color_ramp.length;++i) {
        color_ramp_domain.push((i*(classnum-1)/(color_ramp.length-1)));
    }
    console.log(color_ramp);
    console.log(color_ramp_domain);
    var rfe = d3.scale.linear()
    .domain(color_ramp_domain)
    .range(color_ramp);

    for (i=0;i<classnum-1;++i){
         $("#rfe-choropleth").append("<div class='color-block-rfe colors-"+classnum+"' id='color-"+i+"' data-title='"+d3.hcl(rfe(i)).toString()+"' style='background-color:"+d3.hcl(rfe(i)).toString()+"'>"+d3.hcl(rfe(i)).toString()+"</div>"); 
    }
     $("#rfe-choropleth").append("<div class='color-block-rfe colors-"+classnum+"' id='color-"+(classnum-1)+"' data-title='"+color_ramp[color_ramp.length-1]+"' style='background-color:"+color_ramp[color_ramp.length-1]+"'>"+color_ramp[color_ramp.length-1]+"</div>");
    $(".color-block-rfe").tipper({direction: 'top'});
     $(".color-block-rfe").on("click",function(){
        if ($(this).hasClass("active")) {
            $(".color-block-rfe").removeClass("active");
            $(".notes").html("Click a swatch to copy its hex code as text. <a href='#'>Or, generate a list.</a>");
        } else {
            $(".color-block-rfe").removeClass("active");
            $(this).addClass("active");
            $(".notes").text($(this).text());
        }
    });
}

$(function (){
    generate_scale(d3.hcl("#3c96ba"), 11,5,"1");
    generate_rfe(13);
    $("input:not(#color_classes_choro,.color_input_ramp,.ramp-colorpicker), select").change(function(){
        var base_color = $("#color_input").val();
        var isColor  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(base_color);
        if (base_color.search("#") == -1) {
            base_color = "#"+ base_color;
            $("#color_input").val(base_color);
        }
        if (isColor){
            generate_scale(d3.hcl(base_color), $("#color_classes").val(), $("#color_gamma").val(),$("#color_start").val()); 
        } else {
            $("#color_input").val("#3c96ba");
        }
    });
    $(".color_input_ramp").change(function(){
        var base_color = $(".color_input_ramp").val();
        var isColor  = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(base_color);
        if (base_color.search("#") == -1) {
            base_color = "#"+ base_color;
            $(".color_input_ramp").val(base_color);
        }
        if (isColor){
            generate_rfe($("#color_classes_choro").val()); 
        } else {
            $(".color_input_ramp").val("#3c96ba");
        }
    });
    $("#color_classes_choro").change(function(){
        generate_rfe($(this).val());
    });
    $("#tab-navigation a").on("click", function(e){
        $("ul#color-list").remove();
        $("#tab-navigation li, .tab").removeClass("active");
        $(this).parent().addClass("active");
        $(".tab").eq($('#tab-navigation a').index(this)).addClass("active");
        e.preventDefault();
    });
    $(".color-ramp-item .delete-ramp-stop").on("click", function(e){
        $(this).parent().remove();
        generate_rfe($("#color_classes_choro").val());
        e.preventDefault();
    });
    $(".color-ramp-item .add-ramp-stop").on("click", function(e){
        var start_color = $(this).parent().find(".color_input_ramp").val();
        var end_color = $(this).parent().next().find(".color_input_ramp").val();
        var blend = d3.scale.linear()
        .domain([0,1])
        .range([start_color, end_color]);
        $parent = $(this).parent();
        $(this).parent().clone(true).insertAfter($parent);
        $(this).parent().next().find(".color_input_ramp").val(d3.hcl(blend(.5)).toString());
        $(this).parent().next().find(".ramp-colorpicker").val(d3.hcl(blend(.5)).toString());
        generate_rfe($("#color_classes_choro").val());
        e.preventDefault();
    });
    $(".ramp-colorpicker").on("change", function(){
        $(this).prev().val($(this).val()).trigger("change");
    });
});