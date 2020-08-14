import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@material-ui/core";
import {FC, useEffect} from "react";
import {useForm} from 'react-hook-form'

interface Form {
    code: string
    num: string
}

interface UpsertDialogProps {
    open: boolean

    onClose(): void

    onOk(payload: Form): void

    selected: Leek.Unit | null
    list: Object
}


const UpsertDialog: FC<UpsertDialogProps> = ({open, onClose, onOk, selected, list}) => {
    const {register, handleSubmit, errors, setValue} = useForm<Form>()
    const submit = handleSubmit((data) => {
        onOk(data)
        onClose()
    })
    useEffect(() => {
        if (open) {
            if (selected) {
                console.log(selected)
                setTimeout(()=>{
                    setValue('code', selected.code);
                    setValue('num', list[selected.code])

                },0)
            }
        }
    }, [selected, open, list, setValue])
    return <Dialog open={open} onClose={onClose}>
        <DialogTitle>目标基金</DialogTitle>
        <DialogContent>
            <DialogContentText>
                添加目标基金代码及该基金目前持仓份额
            </DialogContentText>
            <TextField
                margin="dense"
                label="基金代码"
                type="number"
                fullWidth
                name="code"
                inputRef={register({
                    required: {
                        value: true,
                        message: '请输入基金代码'
                    },
                    minLength: {
                        value: 6,
                        message: '基金代码格式错误'
                    },
                    maxLength: {
                        value: 6,
                        message: '基金代码格式错误'
                    },
                })}
                error={!!errors?.code?.message}
                helperText={errors?.code?.message}
            />
            <TextField
                margin="dense"
                label="持仓份额"
                type="number"
                fullWidth
                name="num"
                inputRef={register({
                    required: {
                        value: true,
                        message: '请输入持仓份额'
                    },
                    min: {
                        value: 0,
                        message: '份额不可能小于0'
                    }
                })}
                error={!!errors?.num?.message}
                helperText={errors?.num?.message}
            />

        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                取消
            </Button>
            <Button onClick={submit} color="secondary">
                确认
            </Button>
        </DialogActions>
    </Dialog>
}

export default UpsertDialog
