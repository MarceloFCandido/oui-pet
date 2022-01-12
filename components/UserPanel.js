import NexLink from 'next/link';
import {
  Card,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import classes from '../utils/classes';

function UserPanel(props) {
  const current = props.current;

  return (
    <Grid item md={3} xs={12}>
      <Card sx={classes.section}>
        <List>
          <NexLink href="/perfil" passHref>
            <ListItem selected={current === 'perfil'} button component="a">
              <ListItemText primary="Perfil do Usuário"></ListItemText>
            </ListItem>
          </NexLink>

          <NexLink href="/historico-de-pedidos" passHref>
            <ListItem selected={current === 'historico-de-pedidos'} button component="a">
              <ListItemText primary="Histórico de Pedidos"></ListItemText>
            </ListItem>
          </NexLink>

          <NexLink href="/avaliacoes" passHref>
            <ListItem selected={current === 'avaliacoes'} button component="a">
              <ListItemText primary="Avaliações"></ListItemText>
            </ListItem>
          </NexLink>
        </List>
      </Card>
    </Grid>
  )
}

export default UserPanel;