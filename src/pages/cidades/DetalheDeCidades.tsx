import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { CidadesServices } from '../../shared/services/api/cidades/CidadesServices';
import { VTextField, VForm, useVForm, IVFormErros } from '../../shared/forms';
import { FerramentasDeDetalhe } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';


interface IFormData {
  nome: string;
}

// Esquema de validação do formulario
const formValidationSchema: yup.SchemaOf<IFormData> = yup.object().shape({
  nome: yup.string().required().min(3),
});

export const DetalheDeCidades: React.FC = () => {
  // Variaveis constantes utilizada para vavegar entre as paginas e fornecer o ID
  const { id } = useParams<'id'>();
  const navigate = useNavigate();

  // Pega referencias do Unform para salvar os dados e usar em outro lugar
  const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

  // Mostrar barra de carregamento na tela.
  const [isLoading, setIsLoading] = useState(false);

  // Variavel constante criada para usar no useEffect 
  const [nome, setNome] = useState('');

  //Para carregar os dados de outra tela e armazenar a ser utilizado use useEffect
  useEffect(() => {
    if (id !== 'adicionar') {
      setIsLoading(true);

      CidadesServices.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/cidades');
          }
          else {
            setNome(result.nome);
            formRef.current?.setData(result);
          }
        });
    }
    else {
      formRef.current?.setData({
        nome: '',
      });
    }
  }, [id]);

  // Constante criada para salvar os dados no backend.
  const handleSave = (dados: IFormData) => {

    // Aplicando a validação de erro
    formValidationSchema.
      validate(dados, { abortEarly: false })
      .then((dadosValidados) => {
        setIsLoading(true);

        // Criando usuario na base de dados pelo BackEnd
        if (id === 'adicionar') {
          CidadesServices.create(dadosValidados)
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              } else {
                if (isSaveAndClose()) {
                  navigate('/cidades');
                } else {
                  navigate(`/cidades/detalhe/${result}`);
                }
              }
            });
        }
        // Atualizando usuario na base de dados pelo BackEnd
        else {
          CidadesServices.updateById(Number(id), { id: Number(id), ...dadosValidados })
            .then((result) => {
              setIsLoading(false);

              if (result instanceof Error) {
                alert(result.message);
              }
              else {
                if (isSaveAndClose()) {
                  navigate('/cidades');
                }
              }
            });
        }
      })
      .catch((errors: yup.ValidationError) => {
        const validationErrors: IVFormErros = {};

        errors.inner.forEach(error => {
          if (!error.path) return;

          validationErrors[error.path] = error.message;
        });

        console.log(validationErrors);
        formRef.current?.setErrors(validationErrors);
      });
  };

  // Constante criada para apagar os dados do backend
  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente apagar o registro?')) {
      CidadesServices.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          }
          else {
            alert('Registro apagado com sucesso!');
            navigate('/cidades');
          }
        });
    }
  };

  // RETORNO DA CONSTANTE EXPORT DetalheDeCidades
  return (
    // Importando base da pagina e criando os objetos
    <LayoutBaseDePagina
      titulo={id === 'adicionar' ? 'Adicionando nova cidade' : nome}
      barraDeFerramentas={
        <FerramentasDeDetalhe
          mostrarBotaoSalavarEFechar
          mostrarBotaoNovo={id !== 'adicionar'}
          mostrarBotaoApagar={id !== 'adicionar'}

          aoClicarEmNovo={() => navigate('/cidades/detalhe/adicionar')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmVoltar={() => navigate('/cidades')}

          aoClicarEmSalvar={save}
          aoClicarEmSalvarEFechar={saveAndClose}
        />
      }
    >

      {/*OBJETOS FORMULARIOS DA TELA*/}

      <VForm ref={formRef} onSubmit={handleSave}>
        <Box margin={1} display='flex' flexDirection='column' component={Paper} variant='outlined'>

          <Grid container direction='column' padding={2} spacing={2}>

            <Grid>
              {/*BARRA DE CARREGAMENTO DA TELA*/}

              {isLoading && (
                <LinearProgress variant='indeterminate' />
              )}
            </Grid>

            <Grid item>
              {id === 'adicionar' && (
                <Typography variant='h6'>Nova cidade</Typography>
              )}
              {id !== 'adicionar' && (
                <Typography variant='h6'>Cidade</Typography>
              )}
            </Grid>
            <Grid container item direction='row'>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                <VTextField
                  fullWidth
                  label='Nome'
                  disabled={isLoading}
                  name='nome'
                  onChange={e => setNome(e.target.value)}
                />
              </Grid>
            </Grid>

          </Grid>

        </Box>
      </VForm>

    </LayoutBaseDePagina >
  );
};