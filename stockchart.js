$('.show').modaal();
$('.show').modaal('open');
let chartData = {
    datasets: [
        {
            label: 'Google',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            fill: false,
            data: []
        },
        {
            label: 'Apple',
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: []
        },
        {
            label: 'Facebook',
            backgroundColor: 'rgb(255, 205, 86)',
            borderColor:'rgb(255, 205, 86)',
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: []
        },
        {
            label: 'Amazon',
            backgroundColor: 'rgba(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192)',
            fill: false,
            data: []
        },
        {
            label: 'Netflix',
            backgroundColor: 'rgba(153, 102, 255)',
            borderColor: 'rgba(153, 102, 255)',
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: []
        },
        {
            label: 'Microsoft',
            backgroundColor: 'rgba(255, 159, 64)',
            borderColor: 'rgba(255, 159, 64)',
            fill: false,
            cubicInterpolationMode: 'monotone',
            data: []
        }
    ]
};
// Chart.js の設定
let config = {
    type: 'line', // 折れ線グラフ
    data: chartData, // グラフデータ
    responsive: true, // レスポンシブ対応
    options: {
        legend: {
            position: 'bottom' // 凡例を下に表示
        },

        // ストリーミングデータ表示設定
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    duration: 20000, // グラフに表示する期間(20秒)
                    refresh: 1000, // 再描画間隔(1秒)
                    delay: 4000, // 遅延時間(4秒)
                    // onRefresh: function (chart) {
                    //     chart.data.datasets.forEach(dataset => {
                    //         dataset.data.push({
                    //             x: Date.now(),
                    //             y: Math.random() * 100
                    //         });
                    //     });
                    //     chart.update();
                    // }
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                }
            }]
        },

        // ツールチップ表示のカスタマイズ
        tooltips: {
            mode: 'nearest', // nearest: マウスポインタに近いデータを表示
            intersect: false,
        },
    }
};
let array=[];
let url="https://development-primer.com/js-api/api/stocks";
let urls="";
let savedata=localStorage.getItem('datasave');
let a="["+savedata+"]";
array=JSON.parse(a);
console.log(array);
$(function () {
    // canvas の DOM を取得
    let ctx = $('#canvas');
    // グラフを描画
    let chart = new Chart(ctx, config);
    const time=()=>{$('#time').html(new Date())};
    setInterval(time,1000);
    // let savedata=localStorage.getItem('savedata');
    const a=()=>{console.log(array)};
    setInterval(a,1000);
    $.ajax(url).done((result)=>{
        let index=0;
        for(let i=0;i<chartData.datasets.length;i++){
            $('#box').append(`<p><label><input type="checkbox" id="${result[i].code}" value="${result[i].code}">${result[i].name}</label></p>`);
            if(array[index]===i){
                $(`#${result[i].code}`).prop('checked',true);
                $('#content').append(`<br><div class="box ${result[i].name}"></div><b class="${result[i].name}">${result[i].name}:<span id="${result[i].name}_price"></span><div class="clear"></b>`)
                index++;
            }
        };
    })
    $('#show-modal').on('click',()=>{
        $.ajax(url).done((result)=>{
            let index=0;
            for(let i=0;i<chartData.datasets.length;i++){
                if(array[index]===i){
                    index++;
                }else{
                    $(`#${result[i].code}`).prop('checked',false);
                }
            };
        })
    });
    if(array!==null){
        $.ajax(url).done((result)=>{
            result.forEach((r=>{
                if($(`#${r.code}`).prop('checked')===true){
                    urls=urls+$(`#${r.code}`).val()+","; 
                }
            }))
        })
        console.log(urls);
    };
    $('#select').on('click',()=>{
        $('.show').modaal('close');
        $.ajax(url).done((result)=>{
            let i=0;
            $('#content').html('');
            array=[];
            result.forEach((r,index)=>{
                if($(`#${r.code}`).prop('checked')===true){
                    urls=urls+$(`#${r.code}`).val()+",";
                    $('#content').append(`<br><div class="box ${r.name}"></div><b class="${r.name}">${r.name}:<span id="${r.name}_price"></span></b><div class="clear"></div>`);
                    array[i]=index;
                    i++;  
                }
            })
            var str=JSON.stringify(array);
            localStorage.setItem('datasave',array);
        })
    })
    let price=[];
    let update=()=>{
        $.ajax(url+'/prices/'+urls).done((result)=>{
            for(let i=0;i<array.length;i++){
                chart.data.datasets[array[i]].data.push({
                    x: result[i].timestamp,
                    y: result[i].price,
                })
                price[i]=result[i].price;             
            }
            chart.update();
        });
        $.ajax(url).done((result)=>{
            for(let i=0;i<array.length;i++){
                $(`#${result[array[i]].name}_price`).html(' $ '+price[i]);
            }              
        })
    };
    setInterval(update,2000);
});