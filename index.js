window.addEventListener('load', function (){
    let selectObj = new Select('#select',{
        placeholder: 'Выбери пожалуйста элемент',
        selectedId: '2',
        onSelect() {
            console.log('Selected Item', this.current)
        }
    });

    window.s = selectObj;
});