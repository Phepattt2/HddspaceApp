from torchvision import transforms
from torch.autograd import Variable
from torch.nn import functional as F
import numpy as np
import cv2, torch
import os


import numpy as np
# import matplotlib.pyplot as plt

# generate class activation mapping for the top1 prediction
def returnCAM(feature_conv, weight_softmax, class_idx):
    # generate the class activation maps upsample to 256x256
    size_upsample = (224, 224)
    bz, nc, h, w = feature_conv.shape
    output_cam = []
    for idx in class_idx:
        cam = weight_softmax[class_idx].dot(feature_conv.reshape((nc, h*w)))
        cam = cam.reshape(h, w)
        cam = cam - np.min(cam)
        cam_img = cam / np.max(cam)
        cam_img = np.uint8(255 * cam_img)
        output_cam.append(cv2.resize(cam_img, size_upsample))
    return output_cam

def get_cam(net, features_blobs, img_pil, classes, root_img, path):
    try:
        params = list(net.parameters())
        weight_softmax = np.squeeze(params[-2].data.cpu().numpy())

        # normalize = transforms.Normalize(
        #     mean=[0.485, 0.456, 0.406],
        #     std=[0.229, 0.224, 0.225]
        # )
        preprocess = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            # normalize
        ])

        img_tensor = preprocess(img_pil)
        img_variable = torch.autograd.Variable(img_tensor.unsqueeze(0))
        if torch.cuda.is_available():
            # img_variable = img_variable.cuda()
            img_variable = Variable(img_tensor.unsqueeze(0)).cuda()
        logit = net(img_variable)

        # print(logit)
        h_x = F.softmax(logit, dim=1).data.squeeze()
        # probs = h_x
        probs, idx = h_x.sort(0, True)

        # output: the prediction
        img = cv2.imread(root_img)
        # Resize
        # img = cv2.resize(img,(224,224))
        img_file = root_img.replace('\\','/')
        img_file = img_file.split('/')[-1]
        img_file = img_file.split('.')[0]
        predicted_class = classes[idx[0].item()]
        if not os.path.exists(path + "/" + predicted_class):
            os.mkdir(path + "/" + predicted_class)
        view = ((root_img.replace('\\','/')).split('/')[-1]).split('_')[1]
        image_path = root_img
        if view == 'left' or view == 'right':
            timestamp = (((image_path.replace('\\','/')).split('/')[-1]).split('_')[3]).replace('-','')
            date = timestamp[:8]
            time_temp = timestamp[8:12]
            track = ((image_path.replace('\\','/')).split('/')[-1]).split('_')[0]
            if int(date) >= 20211100: # Reverse (Flip)
                img = img[360:860, 0:1920]
                rotate = cv2.ROTATE_90_COUNTERCLOCKWISE
                if view == 'right':
                    rotate = cv2.ROTATE_90_CLOCKWISE
                img = cv2.rotate(img, rotate)
            elif int(date) >= 20210400: # Reverse (Flip)
                if track == "track1":
                    if view == 'left':
                        img = img[320:800, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                    elif view == 'right':
                        img = img[410:930, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                elif track == 'track2':
                    if view == 'left':
                        img = img[440:940, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                    elif view == 'right':
                        img = img[380:850, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)   
            elif int(date) >= 20210300: # Reverse (Flip)
                if track == "track1":
                    if view == 'left':
                        img = img[320:800, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                    elif view == 'right':
                        img = img[410:930, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                elif track == 'track2':
                    if view == 'left':
                        img = img[440:940, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                    elif view == 'right':
                        img = img[370:840, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)        
            elif int(date) >= 20201200: # Reverse (Flip)
                if track == "track1":
                    if view == 'left':
                        img = img[360:830, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                    elif view == 'right':
                        img = img[330:830, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
                elif int(date) >= 20200900: # Reverse (Flip)
                    if view == 'left':
                        img = img[380:870, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                    elif view == 'right':
                        img = img[330:830, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
                elif int(date) >= 20200721: # Reverse (Flip)
                    if view == 'left':
                        img = img[420:880, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                    elif view == 'right':
                        img = img[320:820, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
                elif int(date) >= 20200714: # Reverse (Flip)
                    if view == 'left':
                        img = img[370:870, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                    elif view == 'right':
                        img = img[320:820, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
                elif int(date) >= 20200602:
                    if view == 'left':
                        img = img[370:870, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
                    elif view == 'right':
                        img = img[360:860, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                elif int(date) >= 20200527:
                    if view == 'left':
                        img = img[300:810, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
                    elif view == 'right':
                        if int(time_temp) >= 1650:
                            img = img[300:800, 0:1920]
                            img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                        else:
                            img = img[370:850, 0:1920]
                            img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                elif int(date) >= 20200320:
                    if view == 'left':
                        img = img[270:770, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
                    elif view == 'right':
                        img = img[290:810, 0:1920]
                        img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)

        print(path + "/" + predicted_class + "/" + img_file + '_raw.jpg')
        cv2.imwrite(path + "/" + predicted_class + "/" + img_file + '_raw.jpg', img)
        for i in range(0, 3):  
            line = '{:.3f} -> {}'.format(probs[i], classes[idx[i].item()])
            # print(line)
            CAMs = returnCAM(features_blobs[0], weight_softmax, [idx[i].item()])
            # # render the CAM and output
            # print('output CAM.jpg for the top1 prediction: %s' % classes[idx[i-1].item()])
            
            height, width, _ = img.shape
            CAM = cv2.resize(CAMs[0], (width, height))
            heatmap = cv2.applyColorMap(CAM, cv2.COLORMAP_JET)
            result = heatmap * 0.3 + img * 0.5
            cv2.imwrite(path + "/" + predicted_class + "/" + img_file + '_' + classes[idx[i].item()] +'_' + "{:.3f}".format(probs[i]) +'.jpg', result)
    except Exception as e:
        print(e)

def get_cam2(net, view, features_blobs, img_pil, classes):
    params = list(net.parameters())
    weight_softmax = np.squeeze(params[-2].data.cpu().numpy())

    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])

    img_tensor = preprocess(img_pil)
    img_variable = Variable(img_tensor.unsqueeze(0)).cuda()
    logit = net(img_variable)

    # print(logit)
    h_x = F.softmax(logit, dim=1).data.squeeze()
    # probs = h_x
    probs, idx = h_x.sort(0, True)

    img = np.array(img_pil, dtype = int)
    #img = img[:, :, ::-1].copy() 
    if view == 'left' or view == 'right':
        if int(date) >= 20201200: # Reverse (Flip)
            if track == "track1":
                if view == 'left':
                    img = img[370:840, 0:1920]
                    img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                elif view == 'right':
                    img = img[420:930, 0:1920]
                    img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
            elif track == 'track2':
                if view == 'left':
                    img = img[340:800, 0:1920]
                    img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
                elif view == 'right':
                    img = img[380:880, 0:1920]
                    img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)        
        elif int(date) >= 20201100: # Reverse (Flip)
            if view == 'left':
                img = img[360:830, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
            elif view == 'right':
                img = img[330:830, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
        elif int(date) >= 20200900: # Reverse (Flip)
            if view == 'left':
                img = img[380:870, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
            elif view == 'right':
                img = img[330:830, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
        elif int(date) >= 20200721: # Reverse (Flip)
            if view == 'left':
                img = img[420:880, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
            elif view == 'right':
                img = img[320:820, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
        elif int(date) >= 20200714: # Reverse (Flip)
            if view == 'left':
                img = img[370:870, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
            elif view == 'right':
                img = img[320:820, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
        elif int(date) >= 20200602:
            if view == 'left':
                img = img[370:870, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
            elif view == 'right':
                img = img[360:860, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
        elif int(date) >= 20200527:
            if view == 'left':
                img = img[300:810, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
            elif view == 'right':
                if int(time_temp) >= 1650:
                    img = img[300:800, 0:1920]
                    img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
                else:
                    img = img[370:850, 0:1920]
                    img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
        elif int(date) >= 20200320:
            if view == 'left':
                img = img[270:770, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
            elif view == 'right':
                img = img[290:810, 0:1920]
                img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)

    CAMs = returnCAM(features_blobs[0], weight_softmax, [idx[0].item()])
    height, width, _ = img.shape
    CAM = cv2.resize(CAMs[0], (width, height))
    heatmap = cv2.applyColorMap(CAM, cv2.COLORMAP_JET)
    result = heatmap * 0.3 + img * 0.5
    result = result.astype('uint8')
    return result, classes[idx[0].item()], probs[0]