export const createTaskValidator = (res, body) => {
  const { title, description } = body;
  if (!title || !description) {
    return res.end(
      JSON.stringify({
        message: "Título e Descrição são campos obrigatórios!",
      })
    );
  }
};
