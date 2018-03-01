import * as React from 'react'

import { extendObservable, action } from 'mobx'
import { observer } from 'mobx-react'

import { withStyles } from 'material-ui/styles'
import Chip from 'material-ui/Chip'
import Button from 'material-ui/Button'
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList'
import Subheader from 'material-ui/List/ListSubheader'
import IconButton from 'material-ui/IconButton'
import Menu, { MenuItem } from 'material-ui/Menu'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import AddIcon from 'material-ui-icons/Add'
import TextField from 'material-ui/TextField'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import Divider from 'material-ui/Divider'

import moment from 'moment'
import _ from 'lodash'


const mockData = {
  documents: [
    { id: 1, title: "这是一个文档", tags: ['高等数学', '学习'], time: (new Date("2017-11-11")).toISOString(), coverUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4113249673,156442410&fm=27&gp=0.jpg" },
    { id: 2, title: "这是一1个文档", tags: ['高等数学', '英语', '语文'], time: (new Date("2016-11-10")).toISOString(), coverUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4113249673,156442410&fm=27&gp=0.jpg" },
    { id: 3, title: "这是又3一个文档", tags: ['线性代数', '学习', '语文'], time: (new Date("2018-1-11")).toISOString(), coverUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4113249673,156442410&fm=27&gp=0.jpg" },
    { id: 4, title: "这是一4个5文档", tags: ['高等数学', '学习', '英语'], time: (new Date("2017-11-11")).toISOString(), coverUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4113249673,156442410&fm=27&gp=0.jpg" },
    { id: 5, title: "这是一31个文档", tags: ['线性代数', '语文', '学习'], time: (new Date("2016-11-10")).toISOString(), coverUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4113249673,156442410&fm=27&gp=0.jpg" },
    { id: 6, title: "这是一5个文4档", tags: ['线性代数', '英语', '语文'], time: (new Date("2016-11-15")).toISOString(), coverUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4113249673,156442410&fm=27&gp=0.jpg" },
    { id: 7, title: "这是一3个文档", time: (new Date("2017-11-11")).toISOString(), coverUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4113249673,156442410&fm=27&gp=0.jpg" },
    { id: 8, title: "这是一34个文档", time: (new Date("2017-12-11")).toISOString(), coverUrl: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4113249673,156442410&fm=27&gp=0.jpg" }
  ],
  groupBy: 'tag'
}


function Store() {
  extendObservable(this, {
    documents: mockData.documents,
    groupBy: mockData.groupBy,
    menuAnchorEl: null,
    menuAnchorId: null,
    tileUpdateDialogState: null,
    askTagNameDialogState: null,
    get contentToShow() {
      let content = this.documents.map(x => {
        const time = moment(x.time)
        return Object.assign({ timestamp: time.unix(), date: this.group === 'time' ? time.format("YYYY-MM") : time.format("YYYY-MM-DD") }, x)
      }).sort((b, a) => a.timestamp - b.timestamp).slice()
      if (this.groupBy === 'time') {
        return _.groupBy(content, ({ date }) => date)
      } else {
        return _.groupBy(
          _.flatMap(content, v => {
            if (v.tags)
              return v.tags.map(tag => (Object.assign({ tag }, v)))
            else
              return Object.assign({ tag: 'untaged' }, v)
          }),
          ({ tag }) => tag)
      }
    },
    handleMenuClick: action((id, { currentTarget }) => {
      this.menuAnchorId = id
      this.menuAnchorEl = currentTarget
    }),
    handleMenuClose: action(() => {
      this.menuAnchorEl = null
      this.menuAnchorId = null
    }),
    handleTileUpdateMenuClick: action(() => {
      const documents = this.documents.filter(({ id }) => id === this.menuAnchorId)
      if (documents.length == 1) {
        const document = documents[0]
        this.tileUpdateDialogState = {
          title: document.title,
          tags: document.tags,
          id: this.menuAnchorId
        }
      }
      this.handleMenuClose()
    }),
    handleTileUpdateDialogConfirm: action(() => {
      for (let item of this.documents) {
        if (item.id === this.tileUpdateDialogState.id) {
          item.title = this.tileUpdateDialogState.title
          item.tags = this.tileUpdateDialogState.tags
          break
        }
      }
      this.handleTileUpdateDialogCancel()
    }),
    handleTileUpdateDialogCancel: action(() => this.tileUpdateDialogState = null)
  })
}

const store = new Store()



const AskTagNameDialog = observer(() => {
  if (typeof (store.askTagNameDialogState) === 'string')
    return <Dialog open={true} onClose={action(() => store.askTagNameDialogState = null)}>
      <DialogTitle id="form-dialog-title">Tag Name</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tag"
          value={store.askTagNameDialogState}
          onChange={action((ev) => store.askTagNameDialogState = ev.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={action(() => store.askTagNameDialogState = null)} color="primary">
          Cancel
            </Button>
        <Button onClick={action(() => {
          store.tileUpdateDialogState.tags.push(store.askTagNameDialogState)
          store.askTagNameDialogState = null
        })} color="primary">
          Add
            </Button>
      </DialogActions>
    </Dialog>
  else return null
})
/** 
 * (typeof(store.askTagNameDialogState)==='string') indicates whether `askTagNameDialog` should be shown.
*/
const TileUpdateDialog = withStyles({
  tagContainer: {
    display: "flex",
    flexFlow: "row wrap"
  },
  Chip: {
    margin: '0.1rem'
  }
})(observer(({ classes }) => {
  if (Boolean(store.tileUpdateDialogState) && !(typeof (store.askTagNameDialogState) === 'string'))
    return <Dialog open={true}
      onClose={store.handleTileUpdateDialogCancel}>
      <DialogTitle id="form-dialog-title">Update</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Title"
          value={store.tileUpdateDialogState.title}
          onChange={ev => store.tileUpdateDialogState.title = ev.target.value}
          fullWidth
        />
        <DialogContentText>
          tags
            </DialogContentText>
        <div className={classes.tagContainer}>
          {store.tileUpdateDialogState.tags.map(tag => <Chip key={tag} label={tag} className={classes.Chip}
            onDelete={action(() => store.tileUpdateDialogState.tags = _.remove(store.tileUpdateDialogState.tags, (_) => _ !== tag))} />)}
          {<Chip avatar={<AddIcon />} onClick={action(() => store.askTagNameDialogState = "")} label="add" className={classes.Chip} />}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={store.handleTileUpdateDialogCancel} color="primary">
          Cancel
            </Button>
        <Button onClick={store.handleTileUpdateDialogConfirm} color="primary">
          Confirm
            </Button>
      </DialogActions>
    </Dialog>
  else return null
}))
/**
 * generate a tile
 * 
 * @param {string} groupBy enum 'tag'|'time'
 */
const Tile = withStyles({
  Tile: {
    maxWidth: "50vw",
    height: "50vw"
  }
})(observer(({ id, coverUrl, title, date, tags, classes }) =>
  <GridListTile key={id} className={classes.Tile}>
    <img src={coverUrl} alt={title} />
    <GridListTileBar
      title={title}
      subtitle={store.groupBy === 'time'
        ? <span>{tags ? tags.map(tag => <Chip style={{ marginRight: "0.3rem" }} key={tag} label={tag} />) : ""}</span>
        : <span>{date}</span>}
      actionIcon={
        <IconButton style={{ color: 'rgba(255, 255, 255, 0.54)' }} onClick={store.handleMenuClick.bind(this, id)}>
          <MoreVertIcon />
        </IconButton>
      }
    />
  </GridListTile>
))

const TileHeader = observer(({ title }) => <GridListTile key={title} cols={2} style={{ width: '70vw' }}>
  <Subheader component="div">{title}</Subheader>
</GridListTile>)

const TileMenu = observer(() => <Menu
  anchorEl={store.menuAnchorEl}
  open={Boolean(store.menuAnchorEl)}
  onClose={store.handleMenuClose}
  PaperProps={{
    style: {
      maxHeight: 48 * 4.5,
      width: 200,
    },
  }}>
  <MenuItem onClick={store.handleTileUpdateMenuClick}>Update</MenuItem>
</Menu>)

const styles = theme => ({
  Root: {
    width: '100%',
    display: "flex",
    justifyContent: "center"
  },
  GirdList: {
    display: "flex",
    flexFlow: "row wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }
})
const DocumentsPage = withStyles(styles)(observer(({ classes }) => <div className={classes.Root}>
  <GridList className={classes.GirdList}>
    {Object.keys(store.contentToShow).map(k =>
      [<TileHeader title={k} />].concat(store.contentToShow[k].map(props => <Tile {...props} />))
    )}
  </GridList>
  <TileMenu />
  <TileUpdateDialog />
  <AskTagNameDialog />
</div>))

export default DocumentsPage


