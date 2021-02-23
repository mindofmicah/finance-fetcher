const data = [];

const addLookup = function (label: string, slug: string, cb?: Function) {
    data.push({
        label,
        slug,
        cb: cb ?? (d => d)
    })
};

addLookup('Revenue', 'revenue', (data) => {
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