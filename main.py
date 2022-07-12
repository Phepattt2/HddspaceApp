"""
Class Activation Mapping
Googlenet, Kaggle data
"""
import platform
from PIL import Image
from update import *
# from data import *
from train import *
import torch, os
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
# from inception import inception_v3
# from model import bottle_screener
import glob
import argparse 
import socket # For getting the server node name
from sys import platform


# def parse_args():
# 	parser = argparse.ArgumentParser()
# 	parser.add_argument('--folder', dest='path', help='provide path for folder of test images',default=(r'').replace('\\','/') , type=str)
# 	parser.add_argument('--model', dest='model', help='Are dataset has been labeled', default="", type=str)	
# 	args = parser.parse_args()
# 	return args

# hook the feature extractor
features_blobs = []
classes = {0: 'A', 1: 'B', 2: 'C'}


def model_iniitialize(model_path):
    from Quantization.model_minimal import bottle_screener
    final_conv = 'Block2'

    device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
    
    model = bottle_screener(num_classes=3)
    model.load_state_dict(torch.load(model_path, map_location='cpu'))

    model.to(device)
    model.eval()
    model._modules.get(final_conv).register_forward_hook(hook_feature)
    return model
    

def hook_feature(module, input, output):
    features_blobs.append(output.data.cpu().numpy())

if __name__ == "__main__":

    # Dataset Path
    path = r'C:\Users\peera\training_set\A'
    model_path = ''
    if platform == "linux" or platform == "linux2":
        # linux, # APEX
        # args = parse_args()
        # path = args.path
        if 'prism' in socket.gethostname() or 'archon' in socket.gethostname():
            model_from_folder_name = ((path.split('/'))[-1]).split('-')[-1] # get model name form miss predicted folder
            model_path = '/home/parnmet/ThaiBev-Recycle-Integrated/model/' + model_from_folder_name + '.ckpt'
        else:
            model_from_folder_name = ((path.replace('\\','/').split('/'))[-1]).split('-')[-1] # get model name form miss predicted folder
            model_path = r'E:\ThaiBev-Recycle-Integrated\model\\' + model_from_folder_name + '.ckpt'
    elif platform == "darwin":     
        # OS X
        model_path = '/Users/parnmet/Desktop/CMKL/Oracle/model/version22.5/top_view_12202021012518_minimal.ckpt'
    elif platform == "win32":
        # Windows...
        model_path = r"C:\Users\peera\Desktop\model\version22.5\top_view_12202021012518_minimal.ckpt"


    if not os.path.isfile(model_path):
        print("No model found")
        import sys
        sys.exit()

    print(model_path)
    model = model_iniitialize(model_path)

    count = 0
    for miss_action_folder in os.listdir(path):
        temp_path = path + '/' + miss_action_folder
        # print(temp_path)
        if '.tiff' not in temp_path and '.DS_Store' not in temp_path:
            for img_file in os.listdir(temp_path):
                print(img_file)
                if '.tiff' in img_file or '.jpg' in img_file:
                    # image_path = os.path.join(path, miss_action_folder, img_file)
                    try:
                        image_path = os.path.join(temp_path, img_file)
                
                        # print(image_path)
                        img = Image.open(image_path)
                        view = ((img_file.replace('\\','/')).split('/')[-1]).split('_')[1]
                        # print('view :',view)
                        if view == 'left' or view == 'right':
                            timestamp = (((image_path.replace('\\','/')).split('/')[-1]).split('_')[3]).replace('-','')
                            date = timestamp[:8]
                            time_temp = timestamp[8:12]
                            track = ((image_path.replace('\\','/')).split('/')[-1]).split('_')[0]
                            if int(date) >= 20211100:
                                area = (0, 360, 1920, 860)          
                                img = img.crop(area)
                                rotate = 90
                                if view == 'right':
                                    rotate = -90
                                img = img.rotate(rotate, expand=True)
                            elif int(date) >= 20210400:
                                if track == "track1":
                                    if view == 'left':
                                        area = (0, 320, 1920, 800)                            # area = (0, 260, 1920, 760)
                                        img = img.crop(area)
                                        img = img.rotate(90, expand=True)
                                    elif view == 'right':
                                        area = (0, 410, 1920, 930)                            # area = (0, 260, 1920, 760)
                                        img = img.crop(area)
                                        img = img.rotate(90, expand=True)
                                elif track == 'track2':
                                    if view == 'left':
                                        area = (0, 440, 1920, 940)
                                        img = img.crop(area)
                                        img = img.rotate(90, expand=True) # <-- REVERSE
                                    elif view == 'right':
                                        area = (0, 380, 1920, 850)
                                        # area = (0, 260, 1920, 760)
                                        img = img.crop(area)
                                        img = img.rotate(-90, expand=True)
                            elif int(date) >= 20210300:
                                if track == "track1":
                                    if view == 'left':
                                        area = (0, 320, 1920, 800)                            # area = (0, 260, 1920, 760)
                                        img = img.crop(area)
                                        img = img.rotate(90, expand=True)
                                    elif view == 'right':
                                        area = (0, 410, 1920, 930)                            # area = (0, 260, 1920, 760)
                                        img = img.crop(area)
                                        img = img.rotate(90, expand=True)
                                elif track == 'track2':
                                    if view == 'left':
                                        area = (0, 440, 1920, 940)
                                        img = img.crop(area)
                                        img = img.rotate(90, expand=True) # <-- REVERSE
                                    elif view == 'right':
                                        area = (0, 370, 1920, 840)
                                        # area = (0, 260, 1920, 760)
                                        img = img.crop(area)
                                        img = img.rotate(-90, expand=True)
                            elif int(date) >= 20201200:
                                if track == "track1":
                                    if view == 'left':
                                        area = (0, 370, 1920, 840)                            # area = (0, 260, 1920, 760)
                                        img = img.crop(area)
                                        img = img.rotate(90, expand=True)
                                    elif view == 'right':
                                        area = (0, 420, 1920, 930)                            # area = (0, 260, 1920, 760)
                                        img = img.crop(area)
                                        img = img.rotate(90, expand=True)
                                elif track == 'track2':
                                    if view == 'left':
                                        area = (0, 340, 1920, 800)
                                        # area = (0, 260, 1920, 760)
                                        img = img.crop(area)
                                        img = img.rotate(-90, expand=True)
                                    elif view == 'right':
                                        area = (0, 380, 1920, 880)
                                        # area = (0, 260, 1920, 760)
                                        img = img.crop(area)
                                        img = img.rotate(90, expand=True)
                            elif int(date) >= 20201100: # Reverse (Flip)
                                if view == 'left':
                                    area = (0, 360, 1920, 830)                            # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(90, expand=True)
                                elif view == 'right':
                                    area = (0, 330, 1920, 830)
                                    # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(-90, expand=True)
                            elif int(date) >= 20200900: # Reverse (Flip)
                                if view == 'left':
                                    area = (0, 380, 1920, 870)                            # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(90, expand=True)
                                elif view == 'right':
                                    area = (0, 330, 1920, 830)
                                    # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(-90, expand=True)
                            elif int(date) >= 20200721: # Reverse (Flip)
                                if view == 'left':
                                    area = (0, 420, 1920, 880)
                                    # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(90, expand=True)
                                elif view == 'right':
                                    area = (0, 320, 1920, 820)
                                    # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(-90, expand=True)
                            elif int(date) >= 20200714: # Reverse (Flip)
                                if view == 'left':
                                    area = (0, 370, 1920, 870)
                                    # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(90, expand=True)
                                elif view == 'right':
                                    area = (0, 320, 1920, 820)
                                    # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(-90, expand=True)
                            elif int(date) >= 20200602:
                                if view == 'left':
                                    area = (0, 370, 1920, 870)
                                    # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(-90, expand=True)
                                elif view == 'right':
                                    area = (0, 360, 1920, 860)
                                    # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(90, expand=True)
                            elif int(date) >= 20200527:
                                if view == 'left':
                                    area = (0, 300, 1920, 810)
                                    # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(-90, expand=True)
                                elif view == 'right':
                                    if int(time_temp) >= 1650:
                                        area = (0, 300, 1920, 800)
                                        # area = (0, 260, 1920, 760)
                                        img = img.crop(area)
                                        img = img.rotate(90, expand=True)
                                    else:
                                        area = (0, 370, 1920, 850)
                                        # area = (0, 260, 1920, 760)
                                        img = img.crop(area)
                                        img = img.rotate(90, expand=True)
                            elif int(date) >= 20200320:
                                if view == 'left':
                                    area = (0, 270, 1920, 770)
                                    # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(-90, expand=True)
                                elif view == 'right':
                                    area = (0, 290, 1920, 810)
                                    # area = (0, 260, 1920, 760)
                                    img = img.crop(area)
                                    img = img.rotate(90, expand=True)
                        dest_path = temp_path
                        # print(dest_path)
                        get_cam(model, features_blobs, img, classes, image_path, dest_path)
                        features_blobs = []
                    except Exception as a:
                        print(a)
                        print('case except',img_file)
                # count+=1
print('ended')