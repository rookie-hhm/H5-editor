import { shallowMount, VueWrapper } from '@vue/test-utils'
import Upload from '@/components/Upload.vue'
import axios from 'axios'
import flushPromises from 'flush-promises'
const testFile = new File(['dasd'], 'test.png', { type: 'image/png'})
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

let wrapper: VueWrapper<any>
describe('Upload.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(Upload, {
      props: {
        action: 'http://localhost:3000/upload'
      }
    })
  })
  it('basic layout before upload', () => {
    expect(wrapper.get('button span').text()).toBe('上传文件')
    expect(wrapper.find('button').exists()).toBeTruthy()
    expect(wrapper.get('input').isVisible()).toBeFalsy()
  })
  it('upload success', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 'success' })
    const fileInput = wrapper.get('input').element as HTMLInputElement
    const files = [testFile] as any
    Object.defineProperty(fileInput, 'files', {
      value: files,
      writable: false
    })
    expect(wrapper.get('button span').text()).toBe('上传文件')
    await wrapper.get('input').trigger('change')
    expect(wrapper.get('button span').text()).toBe('正在上传')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    await flushPromises()
    expect(wrapper.get('button span').text()).toBe('上传成功')
  })
  it('upload error', async () => {
    mockedAxios.post.mockRejectedValueOnce({ status: 'error' })
    await wrapper.get('input').trigger('change')
    expect(wrapper.get('button span').text()).toBe('正在上传')
    expect(mockedAxios.post).toHaveBeenCalledTimes(2)
    await flushPromises()
    expect(wrapper.get('button span').text()).toBe('上传失败')
  })
})
