(() => {
"use strict";

    const testId = document.querySelector("form").id.substring("competition".length) - 0;

    function isNum(v) {
        return !isNaN(parseFloat(v)) && isFinite(v);
    }

    function* getButtons() {
        let q = document.getElementsByClassName("control-group");
        for (let item of q) {
            let i = item.id.match(/\d+$/g)[0];
            if (isNum(i)) {
                yield [i, item.querySelectorAll("[type='radio']")];
            }
        }
    }

    function getMaxChoices() {
        let num = [];
        let btns = Array.from(getButtons()).map((x) => x[1]);
        for (let item of btns) {
            num.push(item.length);
        }
        return Math.max.apply(null, num);
    }

    function getQueryText(id) {
        let s = $("#competition" + id).serialize();
        return s + '&act=verify_test&id=' + id;
    }

    function chooseAnswer(id, num) {
        $.post("modules/competition/competition_ajax.php", getQueryText(id), function(data) {
            select(eval("(" + data + ")"), getButtons(), num);
        });
    }

    function select(data, buttons, num) {
        for (let [key, item] of buttons) {
            if (!data[key] && num < item.length) {
                item[num].click();
            }
        }
    }

    function verify(id) {
        $.post("modules/competition/competition_ajax.php", getQueryText(id), function(data) {
            let json_data = eval("(" + data + ")");
            for (let key in json_data) {
                if (isNum(key)) {
                    if (json_data[key]) {
                        $('#name_control_background_0_'+key).removeClass("false_value");
                        $('#name_control_background_0_'+key).addClass("true_value");
                    } else {
                        $('#name_control_background_0_'+key).removeClass("true_value");
                        $('#name_control_background_0_'+key).addClass("false_value");
                    }
                }
            }
        });
    }

    function createBtn() {
        let btn = document.createElement("a");
        btn.className = "btn btn-info";
        btn.innerHTML = "Узнать баллы";
        btn.style = "top:20px;right:70px;position:fixed;";
        btn.addEventListener("click", () => verify(testId), false);
        document.getElementById("verify_button").append(btn);
    }

    // Pick right radio buttons.
    let max_choices = getMaxChoices();
    for (let i = 0; i < max_choices; ++i) {
        setTimeout(() => chooseAnswer(testId, i), 1000 * i);
    }
    createBtn();
})();