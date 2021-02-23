const data = [];

const addLookup = function (label: string, slug: string, cb?: Function) {
    data.push({
        label,
        slug,
        cb: cb ?? (d => d)
    })
};

addLookup('Revenue', 'revenue', (data) => {
    return Object.values(data).map((a) => {
        const {field_name: field, ...dates} = a;

        const span = document.createElement('span');
        span.innerHTML = field;
        delete dates.popup_icon;
        return {
            name: span.textContent || span.innerText,
            dates

        }
    })


    console.log(data);
    const headings = ['Recent', 'Last year', '3 years ago', '5 years ago']

    return [9, 8, 6, 4].map((index, i) => {
        return [
            headings[i], data[index].date, data[index].v1
        ];
    });
})

export {
    data
};