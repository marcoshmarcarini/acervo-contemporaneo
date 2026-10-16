export async function graphqlRequest(query: string, variables = {}){
    const url = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

    if(!url){
        throw new Error("A variável de ambiente NEXT_PUBLIC_WORDPRESS_API_URL não está definida.");
    }

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({query, variables}),
        next: {revalidate: 60},
    })

    const json = await res.json();

    if(json.errors){
        console.error(json.errors);
        throw new Error('Falha ao buscar dados no GraphQL')
    }
    return json.data;
}