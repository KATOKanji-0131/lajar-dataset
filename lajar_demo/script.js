document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('select2').style.display = 'none';
    document.getElementById('enableSecondField').addEventListener('change', function () {
        const select2 = document.getElementById('select2');
        if (this.checked) {
            select2.style.display = 'inline-block';
        } else {
            select2.style.display = 'none';
            select2.value = ''; // 選択をリセット
        }
        const selectedItem1 = document.getElementById('select1').value;
        const selectedItem2 = this.checked ? document.getElementById('select2').value : null;
        displayItems(selectedItem1, selectedItem2);
    });
    fetch('lajar_data.json')
        .then(response => response.json())
        .then(data => {
            const dropdownContents = data.dropdownContents;
            const locations = data.locations;

            // 項目リストを追加
            const select1 = document.getElementById("select1");
            const select2 = document.getElementById("select2");
            dropdownContents.forEach(content => {
                const option1 = document.createElement("option");
                option1.value = content;
                option1.innerText = content;
                select1.appendChild(option1);

                const option2 = document.createElement("option");
                option2.value = content;
                option2.innerText = content;
                select2.appendChild(option2);
            });

            const map = L.map('map-container').setView([36.2048, 138.2529], 5);

            // OpenStreetMapタイルレイヤー
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const markers = [];

            // 凡例を作成
            const legend = L.control({ position: 'topright' });

            legend.onAdd = function(map) {
                const div = L.DomUtil.create('div', 'legend');
                div.innerHTML = '<h4>凡例</h4>';
                return div;
            };

            legend.addTo(map);

            // 色の設定
            const colors = ['#FF6F61', '#30D5C8', '#DA70D6', '#FFD700', '#32CD32', '#87CEEB', '#FF6347'];
            // 形状の設定
            const shapes = ['circle', 'square', 'diamond', 'triangle', 'invertedTriangle'];

            function getShapeSvg(shape, color) {
                switch (shape) {
                    case 'circle':
                        return `<circle cx="12" cy="12" r="10" fill="${color}" stroke="black" stroke-width="2"/>`;
                    case 'square':
                        return `<rect x="4" y="4" width="16" height="16" fill="${color}" stroke="black" stroke-width="2"/>`;
                    case 'diamond':
                        return `<polygon points="12,2 22,12 12,22 2,12" fill="${color}" stroke="black" stroke-width="2"/>`;
                    case 'triangle':
                        return `<polygon points="12,2 22,20 2,20" fill="${color}" stroke="black" stroke-width="2"/>`;
                    case 'invertedTriangle':
                        return `<polygon points="12,22 22,4 2,4" fill="${color}" stroke="black" stroke-width="2"/>`;
                }
            }

            function displayItems(selectedItem1, selectedItem2 = null) {
                markers.forEach(marker => map.removeLayer(marker));
                markers.length = 0;

                // 凡例をクリア
                const legendDiv = document.querySelector('.legend');
                legendDiv.innerHTML = '<h4>凡例</h4>';

                const selectedValues = new Set();
                const valueToColor = {};
                const valueToShape = {};

                // displayItems の中の locations.forEach() を以下のように修正

                locations.forEach(location => {
                    const infoIndex1 = dropdownContents.indexOf(selectedItem1);
                    const infoObj1 = location.info[infoIndex1];
                    const infoContent1 = infoObj1?.value || '';

                    const infoIndex2 = selectedItem2 ? dropdownContents.indexOf(selectedItem2) : null;
                    const infoObj2 = selectedItem2 ? location.info[infoIndex2] : null;
                    const infoContent2 = infoObj2?.value || '';

                    if (!infoContent1 || (selectedItem2 && !infoContent2)) return;

                    if (!(infoContent1 in valueToColor)) {
                        valueToColor[infoContent1] = colors[Object.keys(valueToColor).length % colors.length];
                    }

                    const color = valueToColor[infoContent1];
                    let shape = 'circle';

                    if (selectedItem2) {
                        if (!(infoContent2 in valueToShape)) {
                            valueToShape[infoContent2] = shapes[Object.keys(valueToShape).length % shapes.length];
                        }
                        shape = valueToShape[infoContent2];
                    }

                    const key = selectedItem2 ? `${infoContent1}-${infoContent2}` : infoContent1;
                    selectedValues.add(key);

                    if (location.latitude && location.longitude) {
                        const shapeSvg = getShapeSvg(shape, color);

                        const icon = L.icon({
                            iconUrl: `data:image/svg+xml;base64,${btoa(`
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                    ${shapeSvg}
                                </svg>
                            `)}`,
                            iconSize: [24, 24],
                            iconAnchor: [12, 24],
                            popupAnchor: [0, -24]
                        });

                        const marker = L.marker([location.latitude, location.longitude], { icon: icon }).addTo(map);

                        marker.on('mouseover', function () {
                            marker.bindTooltip(location.name, { permanent: false, className: "custom-tooltip" }).openTooltip();
                        });

                        marker.on('click', function () {
                            const sourceText1 = infoObj1?.source || '不明';
                            const sourceText2 = infoObj2?.source || '不明';
                            const contributorText = location.contributor || '不明';

                            let popupHtml = `
                                <b>${location.name}</b><br>
                                ${selectedItem1}: ${infoContent1}<br>
                                ${selectedItem2 ? `${selectedItem2}: ${infoContent2}<br>` : ''}
                                <hr style="margin: 4px 0;">
                                <small><b>Contributor:</b> ${contributorText}</small><br>
                                <small><b>Source:</b> ${sourceText1}</small>
                            `;

                            if (selectedItem2) {
                                popupHtml += `<br><small><b>Source (2):</b> ${sourceText2}</small>`;
                            }

                            marker.bindPopup(popupHtml).openPopup();
                        });

                        markers.push(marker);
                    }
                });


                // 凡例をアルファベット順にソートして追加
                const sortedValues = Array.from(selectedValues).sort();
                sortedValues.forEach(value => {
                    const legendItem = document.createElement('div');

                    if (selectedItem2) {
                        const [infoContent1, infoContent2] = value.split('-');
                        const shapeSvg = getShapeSvg(valueToShape[infoContent2], valueToColor[infoContent1]);
                        legendItem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style="vertical-align: middle;">
                            ${shapeSvg}
                        </svg> ${infoContent1} - ${infoContent2}`;
                    } else {
                        const shapeSvg = getShapeSvg('circle', valueToColor[value]);
                        legendItem.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style="vertical-align: middle;">
                            ${shapeSvg}
                        </svg> ${value}`;
                    }

                    legendDiv.appendChild(legendItem);
                });

            }

            let autoCycle;
            let currentIndex = 0;

            function cycleItems() {
                const selectedItem1 = dropdownContents[currentIndex % dropdownContents.length];
                const selectedItem2 = dropdownContents[(currentIndex + 1) % dropdownContents.length];
                displayItems(selectedItem1, selectedItem2);
                currentIndex = (currentIndex + 2) % dropdownContents.length;
            }

            function toggleAutoCycle() {
                const button = document.getElementById("toggle-cycle");
                if (autoCycle) {
                    clearInterval(autoCycle);
                    autoCycle = null;
                    button.innerText = "自動切り替え: オフ";
                } else {
                    autoCycle = setInterval(cycleItems, 3000);
                    button.innerText = "自動切り替え: オン";
                }
            }

            document.getElementById("toggle-cycle").addEventListener("click", toggleAutoCycle);

            select1.addEventListener('change', () => {
                const selectedItem1 = select1.value;
                const selectedItem2 = document.getElementById('enableSecondField').checked ? select2.value : null;
                displayItems(selectedItem1, selectedItem2);
            });
            
            select2.addEventListener('change', () => {
                const selectedItem1 = select1.value;
                const selectedItem2 = document.getElementById('enableSecondField').checked ? select2.value : null;
                displayItems(selectedItem1, selectedItem2);
            });
            

            // Resizable.jsを使用して地図のサイズを変更可能にする
            new Resizable(document.querySelector('#map-container'), {
                minHeight: 200,
                minWidth: 200,
                maxHeight: 800,
                maxWidth: 1000,
                onResize: () => {
                    map.invalidateSize();
                }
            });

            // 初回表示
            function initialDisplay() {
                const selectedItem1 = select1.value;
                const selectedItem2 = select2.value !== "" ? select2.value : null;
                displayItems(selectedItem1, selectedItem2);
            }

            initialDisplay();
        })
        .catch(error => console.error('Error loading JSON:', error));
});

