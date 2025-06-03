$(document).ready(function () {
    const colorMap = {
        'branco': null,
        'vermelho': 'shard_red_empty',
        'azul': 'shard_blue_empty',
        'verde': 'shard_green_empty'
    };

    function loadData() {
        $.getJSON('https://raw.githubusercontent.com/Markkop/corvo-astral/refs/heads/master/data/generated/zenithSublimations.json', function (data) {
            const groupedData = {};

            data.forEach(item => {
                let nomeCompleto = item.translations[1]?.value || 'N/A';
                let sufixo = nomeCompleto.match(/[IVXLCDM]+$/);
                let nome;

                if (!sufixo) {
                    nome = nomeCompleto.trim() + " I";
                    sufixo = 'I';
                } else {
                    nome = nomeCompleto.replace(/\s*[IVXLCDM]+$/, '').trim();
                    sufixo = sufixo[0];
                }

                let efeito = item.parsedEffects?.pt || 'N/A';
                let slots = item.colors_needed?.map(color => color.image_color_empty).join(', ') || 'N/A';
                let lvlmax = item.max_usage || 'N/A';

                if (!groupedData[nome]) {
                    groupedData[nome] = {
                        efeitos: { I: '-', II: '-', III: '-' },
                        slots: 'N/A',
                        lvlmax: lvlmax
                    };
                }

                if (sufixo === 'I') {
                    groupedData[nome].efeitos.I = efeito;
                } else if (sufixo === 'II') {
                    groupedData[nome].efeitos.II = efeito;
                } else if (sufixo === 'III') {
                    groupedData[nome].efeitos.III = efeito;
                }

                if (slots !== 'N/A') {
                    groupedData[nome].slots = slots;
                }

                groupedData[nome].lvlmax = lvlmax;
            });

            for (const [nome, efeitosInfo] of Object.entries(groupedData)) {
                const { I, II, III } = efeitosInfo.efeitos;
                const slotsFinal = efeitosInfo.slots !== 'N/A' ? efeitosInfo.slots : '-';
                var slotcores = slotsFinal.replace(/\s*,\s*/g, '').replace(/\s+/g, '');
                slotcores = slotcores.replace(/shard_red_empty/g, '<img src="imgs/vermelho.webp" class="mr2">')
                                      .replace(/shard_green_empty/g, '<img src="imgs/verde.webp" class="mr2">')
                                      .replace(/shard_blue_empty/g, '<img src="imgs/azul.webp" class="mr2">');

                const nivelMax = efeitosInfo.lvlmax !== 'N/A' ? efeitosInfo.lvlmax : '-';

                $("#tabledata").append(`
<tr class="bg-gray-700">
    <td class="tdborder">${nome.replace(' I', '')}</td>
    <td class="tdborder">${I}</td>
    <td class="tdborder">${II}</td>
    <td class="tdborder">${III}</td>
    <td class="tdborder">${nivelMax}</td>
    <td class="tdborder" style="display:none;">${slotsFinal}</td>
    <td class="tdborder2 items-center">${slotcores}</td>
</tr>
                `);
            }

            applyFilters();
        });
    }

    function generateCombinations(color1, color2, color3) {
        const combinations = [];
        const colors1 = color1 === 'branco' ? ['vermelho', 'azul', 'verde'] : [color1];
        const colors2 = color2 === 'branco' ? ['vermelho', 'azul', 'verde'] : [color2];
        const colors3 = color3 === 'branco' ? ['vermelho', 'azul', 'verde'] : [color3];

        for (let c1 of colors1) {
            for (let c2 of colors2) {
                for (let c3 of colors3) {
                    combinations.push([c1, c2, c3]);
                }
            }
        }

        return combinations;
    }

    function checkMatches(slots, combinations) {
        return combinations.some(combination => {
            return combination.every((color, index) => {
                const expectedColor = colorMap[color];
                return expectedColor === null || slots[index] === expectedColor;
            });
        });
    }

    function applyFilters() {
        const selectedColors = [
            $("#select1").val(),
            $("#select2").val(),
            $("#select3").val(),
            $("#select4").val()
        ];

        const combinations1 = generateCombinations(selectedColors[0], selectedColors[1], selectedColors[2]);
        const combinations2 = generateCombinations(selectedColors[1], selectedColors[2], selectedColors[3]);

        $("#tabledata tr").each(function () {
            const slots = $(this).find('td').eq(5).text().split(', ');
            const matches1 = checkMatches(slots, combinations1);
            const matches2 = checkMatches(slots, combinations2);

            $(this).toggle(matches1 || matches2 || $(this).find('td:first').text() === 'Nome');
        });
    }

    $("#select1, #select2, #select3, #select4").change(applyFilters);
    $('#select1, #select2, #select3, #select4').change(function () {
applyFilters();
});
$("#select1").change(function() {
var selectedValue = $(this).val(); // Obter o valor selecionado
$("#slot1").attr("src", "imgs/" + selectedValue + ".webp"); // Definir o novo src
});
$("#select2").change(function() {
var selectedValue = $(this).val(); // Obter o valor selecionado
$("#slot2").attr("src", "imgs/" + selectedValue + ".webp"); // Definir o novo src
});

$("#select3").change(function() {
var selectedValue = $(this).val(); // Obter o valor selecionado
$("#slot3").attr("src", "imgs/" + selectedValue + ".webp"); // Definir o novo src
});

$("#select4").change(function() {
var selectedValue = $(this).val(); // Obter o valor selecionado
$("#slot4").attr("src", "imgs/" + selectedValue + ".webp"); // Definir o novo src
});

    loadData();
});